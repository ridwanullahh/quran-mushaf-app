interface CloudinaryConfig {
  uploadPreset?: string;
  cloudName?: string;
  apiKey?: string;
  apiSecret?: string;
}

interface SMTPConfig {
  endpoint?: string;
  from?: string;
  test?: () => Promise<boolean>;
}

interface AuthConfig {
  requireEmailVerification?: boolean;
  otpTriggers?: string[];
}

interface SchemaDefinition {
  required?: string[];
  types?: Record<string, string>;
  defaults?: Record<string, any>;
}

interface UniversalSDKConfig {
  owner: string;
  repo: string;
  token: string;
  branch?: string;
  basePath?: string;
  mediaPath?: string;
  cloudinary?: CloudinaryConfig;
  smtp?: SMTPConfig;
  templates?: Record<string, string>;
  schemas?: Record<string, SchemaDefinition>;
  auth?: AuthConfig;
}

interface User {
  id?: string;
  uid?: string;
  email: string;
  password?: string;
  googleId?: string;
  verified?: boolean;
  roles?: string[];
  permissions?: string[];
  schoolId?: string;
  [key: string]: any;
}

interface Session {
  token: string;
  user: User;
  created: number;
}

interface QueryBuilder<T = any> {
  where(fn: (item: T) => boolean): QueryBuilder<T>;
  sort(field: string, dir?: 'asc' | 'desc'): QueryBuilder<T>;
  project(fields: string[]): QueryBuilder<Partial<T>>;
  exec(): Promise<T[]>;
}

class UniversalSDK {
  private owner: string;
  private repo: string;
  private token: string;
  private branch: string;
  private basePath: string;
  private cache: Record<string, { data: any[], etag?: string, sha?: string }> = {};

  constructor(config: UniversalSDKConfig) {
    this.owner = config.owner;
    this.repo = config.repo;
    this.token = config.token;
    this.branch = config.branch || "main";
    this.basePath = config.basePath || "db";
  }

  private headers(): Record<string, string> {
    return {
      Authorization: `token ${this.token}`,
      "Content-Type": "application/json",
    };
  }

  private async request(path: string, method: string = "GET", body: any = null, etag?: string): Promise<any> {
    const url = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${path}` +
                (method === "GET" ? `?ref=${this.branch}` : "");

    const headers = this.headers();
    if (etag) {
      headers["If-None-Match"] = etag;
    }

    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    if (res.status === 304) {
      return { notModified: true };
    }

    if (!res.ok) throw new Error(await res.text());

    if (res.status === 204 || res.status === 201) {
      return { success: true, ...await res.json() };
    }

    const json = await res.json();
    return { ...json, etag: res.headers.get("ETag") };
  }

  async get<T = any>(collection: string, force = false): Promise<T[]> {
    const cacheEntry = this.cache[collection];

    if (cacheEntry && !force) {
      return cacheEntry.data;
    }

    try {
      const res = await this.request(`${this.basePath}/${collection}.json`, "GET", null, cacheEntry?.etag);

      if (res.notModified) {
        return cacheEntry.data;
      }

      const data = JSON.parse(atob(res.content));

      this.cache[collection] = { data, etag: res.etag, sha: res.sha };

      return data;
    } catch (e) {
      if ((e as Error).message.includes("Not Found")) {
        this.cache[collection] = { data: [], etag: undefined, sha: undefined };
        return [];
      }
      throw e;
    }
  }

  async getItem<T = any>(collection: string, key: string): Promise<T | null> {
    const arr = await this.get<T>(collection);
    return arr.find((x: any) => x.id === key || x.uid === key) || null;
  }

  async insert<T = any>(collection: string, item: Partial<T>): Promise<T & { id: string; uid: string }> {
    const arr = await this.get<T>(collection);
    const id = (Math.max(0, ...arr.map((x: any) => +x.id || 0)) + 1).toString();
    const newItem = { uid: crypto.randomUUID(), id, ...item } as T & { id: string; uid: string };
    arr.push(newItem);
    await this.save(collection, arr);
    return newItem;
  }

  async bulkInsert<T = any>(collection: string, items: Partial<T>[]): Promise<(T & { id: string; uid: string })[]> {
    const arr = await this.get<T>(collection);
    const base = Math.max(0, ...arr.map((x: any) => +x.id || 0));
    
    const newItems = items.map((item, i) => {
      return { uid: crypto.randomUUID(), id: (base + i + 1).toString(), ...item } as T & { id: string; uid: string };
    });

    const result = [...arr, ...newItems];
    await this.save(collection, result);
    return newItems;
  }

  async update<T = any>(collection: string, key: string, updates: Partial<T>): Promise<T> {
    await this.get(collection, true);
    const arr = [...(this.cache[collection]?.data || [])];
    const itemIndex = arr.findIndex((x: any) => x.id === key || x.uid === key);
    if (itemIndex === -1) {
      throw new Error(`Item with key "${key}" not found in collection "${collection}".`);
    }
    const updatedItem = { ...arr[itemIndex], ...updates };
    arr[itemIndex] = updatedItem;
    await this.save(collection, arr);
    return updatedItem;
  }

  async delete(collection: string, key: string): Promise<void> {
    const arr = await this.get(collection);
    const filtered = arr.filter((x: any) => x.id !== key && x.uid !== key);
    await this.save(collection, filtered);
  }

  private save<T = any>(collection: string, data: T[]): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.cache[collection] = { ...this.cache[collection], data };
      this.writeQueue.push({
        collection,
        data,
        resolve,
        reject,
        retries: 0
      });
      if (!this.isProcessingQueue) {
        this.processQueue();
      }
    });
  }

  private writeQueue: any[] = [];
  private isProcessingQueue = false;

  private async processQueue() {
    if (this.isProcessingQueue || this.writeQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;
    const write = this.writeQueue[0];

    try {
      const { collection, data, resolve } = write;
      const file = await this.request(`${this.basePath}/${collection}.json`).catch(() => ({ sha: undefined }));

      await this.request(`${this.basePath}/${collection}.json`, "PUT", {
        message: `Update ${collection} - ${new Date().toISOString()}`,
        content: btoa(JSON.stringify(data, null, 2)),
        branch: this.branch,
        sha: file.sha,
      });

      this.writeQueue.shift();
      this.get(collection, true);
      resolve(data);
    } catch (error: any) {
      if (error.message.includes("409") && write.retries < 5) {
        write.retries++;
      } else {
        write.reject(error);
        this.writeQueue.shift();
      }
    } finally {
      this.isProcessingQueue = false;
      if (this.writeQueue.length > 0) {
        setTimeout(() => this.processQueue(), 250);
      }
    }
  }

  queryBuilder<T = any>(collection: string): QueryBuilder<T> {
    let chain = Promise.resolve().then(() => this.get<T>(collection));

    const qb: QueryBuilder<T> = {
      where(fn: (item: T) => boolean) {
        chain = chain.then(arr => arr.filter(fn));
        return qb;
      },
      sort(field: string, dir: 'asc' | 'desc' = "asc") {
        chain = chain.then(arr => arr.sort((a: any, b: any) =>
          dir === 'asc' ? (a[field] > b[field] ? 1 : -1) : (a[field] < b[field] ? 1 : -1)
        ));
        return qb;
      },
      project(fields: string[]) {
        chain = chain.then(arr => arr.map((item: any) => {
          const o: any = {};
          fields.forEach(f => {
            if (f in item) o[f] = item[f]
          });
          return o
        }));
        return qb as QueryBuilder<any>;
      },
      exec() { return chain; },
    };
    return qb;
  }

  async register(email: string, password: string, userData: any = {}): Promise<User> {
    return this.insert<User>("users", { email, password, ...userData });
  }

  async login(email: string, password: string): Promise<string | { otpRequired: boolean }> {
    const user = (await this.get<User>("users")).find(u => u.email === email);
    if (!user || user.password !== password) throw new Error("Invalid credentials");
    return this.createSession(user);
  }

  getUser(id: string): Promise<User | null> {
    return this.getItem<User>("users", id);
  }

  createSession(user: User): string {
    const token = crypto.randomUUID();
    return token;
  }

  async init(): Promise<UniversalSDK> {
    return this;
  }
}

export default UniversalSDK;
export type {
  UniversalSDKConfig,
  CloudinaryConfig,
  SMTPConfig,
  AuthConfig,
  SchemaDefinition,
  User,
  Session,
  QueryBuilder,
};