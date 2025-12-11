// Enhanced GitHub DB SDK with Schema Evolution and Improved Features
// Version: 2.0.0 - Production Ready

import crypto from 'crypto';

interface CloudinaryConfig {
  uploadPreset?: string;
  cloudName?: string;
  apiKey?: string;
  apiSecret?: string;
}

interface PaystackConfig {
  publicKey: string;
  secretKey: string;
}

interface StripeConfig {
  publicKey: string;
  secretKey: string;
}

interface FlutterwaveConfig {
  publicKey: string;
  secretKey: string;
}

interface RazorpayConfig {
  keyId: string;
  keySecret: string;
}

interface PaypalConfig {
  clientId: string;
  clientSecret: string;
  mode: 'sandbox' | 'live';
}

interface PaymentGatewayConfig {
  paystack?: PaystackConfig;
  stripe?: StripeConfig;
  flutterwave?: FlutterwaveConfig;
  razorpay?: RazorpayConfig;
  paypal?: PaypalConfig;
}

interface AuthConfig {
  requireEmailVerification?: boolean;
  otpTriggers?: string[];
}

interface SchemaDefinition {
  required?: string[];
  types?: Record<string, string>;
  defaults?: Record<string, any>;
  validation?: (item: any) => boolean;
}

interface UniversalSDKConfig {
  owner: string;
  repo: string;
  token: string;
  branch?: string;
  basePath?: string;
  mediaPath?: string;
  cloudinary?: CloudinaryConfig;
  templates?: Record<string, string>;
  schemas?: Record<string, SchemaDefinition>;
  auth?: AuthConfig;
  paymentGateways?: PaymentGatewayConfig;
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

interface OTPRecord {
  otp: string;
  created: number;
  reason: string;
}

interface AuditLogEntry {
  action: string;
  data: any;
  timestamp: number;
}

interface QueryBuilder<T = any> {
  where(fn: (item: T) => boolean): QueryBuilder<T>;
  sort(field: string, dir?: 'asc' | 'desc'): QueryBuilder<T>;
  project(fields: string[]): QueryBuilder<Partial<T>>;
  limit(count: number): QueryBuilder<T>;
  exec(): Promise<T[]>;
}

interface MediaAttachment {
  attachmentId: string;
  mimeType: string;
  isInline: boolean;
  url: string;
  name: string;
}

interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  [key: string]: any;
}

interface QueuedWrite {
  collection: string;
  data: any[];
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
  retries: number;
  timestamp: number;
}

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  from: string;
  text?: string;
}

interface SchemaMigration {
  version: number;
  collection: string;
  up: (data: any[]) => Promise<any[]>;
  down: (data: any[]) => Promise<any[]>;
}

class EnhancedUniversalSDK {
  private owner: string;
  private repo: string;
  private token: string;
  private branch: string;
  private basePath: string;
  private mediaPath: string;
  private cloudinary: CloudinaryConfig;
  private paymentGateways: PaymentGatewayConfig;
  private templates: Record<string, string>;
  private schemas: Record<string, SchemaDefinition>;
  private schemaMigrations: Map<string, SchemaMigration[]> = new Map();
  private authConfig: AuthConfig;
  private sessionStore: Record<string, Session>;
  private otpMemory: Record<string, OTPRecord>;
  private auditLog: Record<string, AuditLogEntry[]>;
  private cache: Record<string, { data: any[], etag?: string, sha?: string, lastUpdated: number }> = {};
  private subscribers: Record<string, Function[]> = {};
  private pollingIntervals: Record<string, number> = {};
  private writeQueue: QueuedWrite[] = [];
  private isProcessingQueue = false;
  private schemaEvolutionRunning = false;
  private initialized = false;

  constructor(config: UniversalSDKConfig) {
    this.owner = config.owner;
    this.repo = config.repo;
    this.token = config.token;
    this.branch = config.branch || "main";
    this.basePath = config.basePath || "db";
    this.mediaPath = config.mediaPath || "media";
    this.cloudinary = config.cloudinary || {};
    this.paymentGateways = config.paymentGateways || {};
    this.templates = config.templates || {};

    // Enhanced schemas for Quran app
    this.schemas = {
      // Quran core data
      surahs: {
        types: {
          id: 'string',
          name: 'string',
          arabicName: 'string',
          revelationType: 'string', // 'meccan' or 'medinan'
          numberOfAyahs: 'number',
          juz: 'number',
          hizb: 'number',
          order: 'number'
        },
        required: ['id', 'name', 'arabicName', 'numberOfAyahs', 'order']
      },
      
      ayahs: {
        types: {
          id: 'string',
          surahId: 'string',
          ayahNumber: 'number',
          pageNumber: 'number',
          juzNumber: 'number',
          hizbNumber: 'number',
          rukuNumber: 'number',
          arabicText: 'string',
          tafseer: 'object',
          audioUrl: 'string'
        },
        required: ['id', 'surahId', 'ayahNumber', 'arabicText']
      },
      
      // Word-by-word data
      wordAnalysis: {
        types: {
          id: 'string',
          ayahId: 'string',
          wordIndex: 'number',
          arabicWord: 'string',
          transliteration: 'string',
          morphology: 'object',
          meaning: 'object', // Multiple languages
          tafseerNotes: 'object', // Multiple languages
          tajweedClass: 'string'
        },
        required: ['id', 'ayahId', 'wordIndex', 'arabicWord']
      },
      
      // Translations
      translations: {
        types: {
          id: 'string',
          ayahId: 'string',
          language: 'string',
          translator: 'string',
          translation: 'string',
          notes: 'string'
        },
        required: ['id', 'ayahId', 'language', 'translation']
      },
      
      // Tafseers
      tafseers: {
        types: {
          id: 'string',
          ayahId: 'string',
          scholar: 'string',
          explanation: 'object', // Multiple languages
          source: 'string',
          language: 'string'
        },
        required: ['id', 'ayahId', 'scholar', 'explanation']
      },
      
      // Audio recitations
      recitations: {
        types: {
          id: 'string',
          ayahId: 'string',
          reciter: 'string',
          audioUrl: 'string',
          duration: 'number',
          quality: 'string'
        },
        required: ['id', 'ayahId', 'reciter', 'audioUrl']
      },
      
      // Users and admin
      users: {
        types: {
          id: 'string',
          uid: 'string',
          email: 'string',
          password: 'string',
          googleId: 'string',
          verified: 'boolean',
          roles: 'array',
          permissions: 'array',
          profile: 'object'
        },
        required: ['email']
      },
      
      // Admin management
      adminSettings: {
        types: {
          id: 'string',
          key: 'string',
          value: 'object',
          description: 'string',
          lastModified: 'date'
        },
        required: ['id', 'key', 'value']
      },
      
      // Content versioning
      contentVersions: {
        types: {
          id: 'string',
          contentType: 'string',
          contentId: 'string',
          version: 'string',
          data: 'object',
          author: 'string',
          createdAt: 'date',
          published: 'boolean'
        },
        required: ['id', 'contentType', 'contentId', 'version']
      },
      
      ...config.schemas
    };

    this.authConfig = config.auth || { requireEmailVerification: true, otpTriggers: ["register"] };
    this.sessionStore = {};
    this.otpMemory = {};
    this.auditLog = {};

    this.setupSchemaMigrations();
  }

  private setupSchemaMigrations(): void {
    // Define migrations for Quran data
    this.schemaMigrations.set('ayahs', [
      {
        version: 1,
        collection: 'ayahs',
        up: async (data: any[]) => {
          return data.map(item => ({
            ...item,
            tafseer: item.tafseer || {},
            audioUrl: item.audioUrl || null,
            createdAt: item.createdAt || new Date().toISOString()
          }));
        },
        down: async (data: any[]) => data
      }
    ]);
  }

  private headers(): Record<string, string> {
    return {
      Authorization: `token ${this.token}`,
      "Content-Type": "application/json",
      "Accept": "application/vnd.github.v3+json"
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

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`GitHub API Error ${res.status}: ${errorText}`);
    }

    if (res.status === 204 || res.status === 201) {
      return { success: true, ...await res.json() };
    }

    const json = await res.json();
    return { ...json, etag: res.headers.get("ETag") };
  }

  async init(): Promise<EnhancedUniversalSDK> {
    if (this.initialized) return this;
    
    try {
      // Run schema evolution
      await this.runSchemaEvolution();
      
      this.initialized = true;
      return this;
    } catch (error) {
      console.error('SDK initialization failed:', error);
      throw error;
    }
  }

  private async runSchemaEvolution(): Promise<void> {
    if (this.schemaEvolutionRunning) return;
    
    this.schemaEvolutionRunning = true;
    
    try {
      const collections = Object.keys(this.schemas);
      
      for (const collection of collections) {
        await this.ensureCollectionExists(collection);
        await this.applyMigrations(collection);
      }
      
      console.log('Schema evolution completed successfully');
    } catch (error) {
      console.error('Schema evolution failed:', error);
      throw error;
    } finally {
      this.schemaEvolutionRunning = false;
    }
  }

  private async ensureCollectionExists(collection: string): Promise<void> {
    try {
      await this.get(collection, true); // Force refresh
    } catch (error) {
      if ((error as Error).message.includes("Not Found")) {
        // Collection doesn't exist, create it
        await this.save(collection, []);
        console.log(`Created collection: ${collection}`);
      } else {
        throw error;
      }
    }
  }

  private async applyMigrations(collection: string): Promise<void> {
    const migrations = this.schemaMigrations.get(collection);
    if (!migrations) return;

    try {
      const currentData = await this.get(collection);
      let migratedData = [...currentData];

      for (const migration of migrations) {
        console.log(`Applying migration v${migration.version} to ${collection}`);
        migratedData = await migration.up(migratedData);
      }

      // Only save if data changed
      if (JSON.stringify(migratedData) !== JSON.stringify(currentData)) {
        await this.save(collection, migratedData);
        console.log(`Migrated collection: ${collection}`);
      }
    } catch (error) {
      console.error(`Migration failed for ${collection}:`, error);
      throw error;
    }
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
      
      this.cache[collection] = { 
        data, 
        etag: res.etag, 
        sha: res.sha,
        lastUpdated: Date.now()
      };
      
      this.notifySubscribers(collection, data);
      return data;
    } catch (e) {
      if ((e as Error).message.includes("Not Found")) {
        // Collection doesn't exist, create it
        this.cache[collection] = { data: [], etag: undefined, sha: undefined, lastUpdated: Date.now() };
        return [];
      }
      throw e;
    }
  }

  private notifySubscribers(collection: string, data: any[]): void {
    (this.subscribers[collection] || []).forEach(cb => cb(data));
  }

  subscribe<T = any>(collection: string, callback: (data: T[]) => void): () => void {
    if (!this.subscribers[collection]) {
      this.subscribers[collection] = [];
    }
    
    this.subscribers[collection].push(callback);

    if (!this.pollingIntervals[collection]) {
      this.pollCollection(collection);
      const intervalId = setInterval(() => this.pollCollection(collection), 10000); // Poll every 10 seconds
      this.pollingIntervals[collection] = intervalId as any;
    }

    // Immediately provide current data
    if (this.cache[collection]) {
      callback(this.cache[collection].data);
    } else {
      this.get(collection).then(data => callback(data));
    }

    return () => this.unsubscribe(collection, callback);
  }

  unsubscribe(collection: string, callback: Function): void {
    this.subscribers[collection] = (this.subscribers[collection] || []).filter(cb => cb !== callback);
    
    if (this.subscribers[collection].length === 0) {
      clearInterval(this.pollingIntervals[collection]);
      delete this.pollingIntervals[collection];
    }
  }

  private async pollCollection(collection: string): Promise<void> {
    try {
      const cacheEntry = this.cache[collection];
      const res = await this.request(`${this.basePath}/${collection}.json`, "GET", null, cacheEntry?.etag);

      if (!res.notModified) {
        const data = JSON.parse(atob(res.content));
        this.cache[collection] = { data, etag: res.etag, sha: res.sha, lastUpdated: Date.now() };
        this.notifySubscribers(collection, data);
      }
    } catch (error) {
      console.error(`Polling failed for ${collection}:`, error);
    }
  }

  async getItem<T = any>(collection: string, key: string): Promise<T | null> {
    const arr = await this.get<T>(collection);
    return arr.find((x: any) => x.id === key || x.uid === key) || null;
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.writeQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;
    const write = this.writeQueue[0];

    try {
      const { collection, data, resolve } = write;

      // Get current file SHA for optimistic locking
      let currentSha: string | undefined;
      try {
        const file = await this.request(`${this.basePath}/${collection}.json`);
        currentSha = file.sha;
      } catch {
        // File might not exist, will be created
      }

      const commitMessage = `Update ${collection} - ${new Date().toISOString()}`;
      await this.request(`${this.basePath}/${collection}.json`, "PUT", {
        message: commitMessage,
        content: btoa(JSON.stringify(data, null, 2)),
        branch: this.branch,
        sha: currentSha,
      });

      this.writeQueue.shift(); // Remove from queue on success
      await this.get(collection, true); // Force-fetch latest data

      resolve(data);
    } catch (error: any) {
      if (error.message.includes("409") && write.retries < 5) { // Conflict
        write.retries++;
        // Don't remove from queue, will retry
        console.log(`Retry ${write.retries}/5 for ${write.collection}`);
      } else {
        write.reject(error);
        this.writeQueue.shift(); // Remove from queue on hard failure
        console.error(`Write failed for ${write.collection}:`, error);
      }
    } finally {
      this.isProcessingQueue = false;
      
      // Immediately process next item
      if (this.writeQueue.length > 0) {
        setTimeout(() => this.processQueue(), 500);
      }
    }
  }

  private save<T = any>(collection: string, data: T[]): Promise<T[]> {
    return new Promise((resolve, reject) => {
      // Optimistic update
      this.cache[collection] = { ...this.cache[collection], data, lastUpdated: Date.now() };
      this.notifySubscribers(collection, data);

      this.writeQueue.push({
        collection,
        data,
        resolve,
        reject,
        retries: 0,
        timestamp: Date.now()
      });

      if (!this.isProcessingQueue) {
        this.processQueue();
      }
    });
  }

  async insert<T = any>(collection: string, item: Partial<T>): Promise<T & { id: string; uid: string }> {
    const arr = await this.get<T>(collection);
    const schema = this.schemas[collection];

    if (schema?.defaults) item = { ...schema.defaults, ...item };
    this.validateSchema(collection, item);

    const id = (Math.max(0, ...arr.map((x: any) => +x.id || 0)) + 1).toString();
    const newItem = { uid: crypto.randomUUID(), id, ...item } as T & { id: string; uid: string };

    arr.push(newItem);
    await this.save(collection, arr);
    this._audit(collection, newItem, "insert");

    return newItem;
  }

  async bulkInsert<T = any>(collection: string, items: Partial<T>[]): Promise<(T & { id: string; uid: string })[]> {
    const arr = await this.get<T>(collection);
    const schema = this.schemas[collection];
    const base = Math.max(0, ...arr.map((x: any) => +x.id || 0));

    const newItems = items.map((item, i) => {
      if (schema?.defaults) item = { ...schema.defaults, ...item };
      this.validateSchema(collection, item);
      return { uid: crypto.randomUUID(), id: (base + i + 1).toString(), ...item } as T & { id: string; uid: string };
    });

    const result = [...arr, ...newItems];
    await this.save(collection, result);
    newItems.forEach(n => this._audit(collection, n, "insert"));

    return newItems;
  }

  async update<T = any>(collection: string, key: string, updates: Partial<T>): Promise<T> {
    await this.get(collection, true); // Ensure we have latest data
    const arr = [...(this.cache[collection]?.data || [])];
    const itemIndex = arr.findIndex((x: any) => x.id === key || x.uid === key);

    if (itemIndex === -1) {
      throw new Error(`Item with key "${key}" not found in collection "${collection}".`);
    }

    const updatedItem = { ...arr[itemIndex], ...updates };
    this.validateSchema(collection, updatedItem);
    arr[itemIndex] = updatedItem;

    await this.save(collection, arr);
    this._audit(collection, updatedItem, "update");

    return updatedItem;
  }

  async bulkUpdate<T = any>(collection: string, updates: (Partial<T> & { id?: string; uid?: string })[]): Promise<T[]> {
    const arr = await this.get<T>(collection);
    const updatedItems = updates.map(u => {
      const i = arr.findIndex((x: any) => x.id === u.id || x.uid === u.uid);
      if (i < 0) throw new Error(`Item not found: ${u.id || u.uid}`);
      const upd = { ...arr[i], ...u };
      this.validateSchema(collection, upd);
      arr[i] = upd;
      return upd;
    });

    await this.save(collection, arr);
    updatedItems.forEach(u => this._audit(collection, u, "update"));

    return updatedItems;
  }

  async delete<T = any>(collection: string, key: string): Promise<void> {
    const arr = await this.get<T>(collection);
    const filtered = arr.filter((x: any) => x.id !== key && x.uid !== key);
    const deleted = arr.filter((x: any) => x.id === key || x.uid === key);

    await this.save(collection, filtered);
    deleted.forEach(d => this._audit(collection, d, "delete"));
  }

  async bulkDelete<T = any>(collection: string, keys: string[]): Promise<T[]> {
    const arr = await this.get<T>(collection);
    const filtered = arr.filter((x: any) => !keys.includes(x.id) && !keys.includes(x.uid));
    const deleted = arr.filter((x: any) => keys.includes(x.id) || keys.includes(x.uid));

    await this.save(collection, filtered);
    deleted.forEach(d => this._audit(collection, d, "delete"));

    return deleted;
  }

  private validateSchema(collection: string, item: any): void {
    const schema = this.schemas[collection];
    if (!schema) return;

    // Check required fields
    (schema.required || []).forEach(r => {
      if (!(r in item)) throw new Error(`Missing required field: ${r} in ${collection}`);
    });

    // Validate types
    Object.entries(item).forEach(([k, v]) => {
      const t = schema.types?.[k];
      if (t) {
        const ok =
          (t === "string" && typeof v === "string") ||
          (t === "number" && typeof v === "number") ||
          (t === "boolean" && typeof v === "boolean") ||
          (t === "object" && typeof v === "object") ||
          (t === "array" && Array.isArray(v)) ||
          (t === "date" && !isNaN(Date.parse(v as string))) ||
          (t === "uuid" && typeof v === "string");

        if (!ok) throw new Error(`Field ${k} should be ${t} in ${collection}`);
      }
    });

    // Custom validation
    if (schema.validation && !schema.validation(item)) {
      throw new Error(`Custom validation failed for ${collection}`);
    }
  }

  // Authentication methods
  async register(email: string, password: string, profile: Partial<User> = {}): Promise<User> {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error("Invalid email format");
    
    const users = await this.get<User>("users");
    if (users.find(u => u.email === email)) throw new Error("Email already registered");

    const hashed = this.hashPassword(password);
    const user = await this.insert<User>("users", { email, password: hashed, ...profile });
    
    return user;
  }

  async login(email: string, password: string): Promise<string | { otpRequired: boolean }> {
    const user = (await this.get<User>("users")).find(u => u.email === email);
    if (!user || !this.verifyPassword(password, user.password!)) throw new Error("Invalid credentials");

    return this.createSession(user);
  }

  private hashPassword(password: string): string {
    const salt = crypto.randomUUID();
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return `${salt}$${hash}`;
  }

  private verifyPassword(password: string, hashString: string): boolean {
    const [salt, hash] = hashString.split('$');
    const testHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return testHash === hash;
  }

  private createSession(user: User): string {
    const token = crypto.randomUUID();
    this.sessionStore[token] = { token, user, created: Date.now() };
    return token;
  }

  getSession(token: string): Session | null {
    return this.sessionStore[token] || null;
  }

  getCurrentUser(token: string): User | null {
    const session = this.getSession(token);
    return session?.user || null;
  }

  destroySession(token: string): boolean {
    delete this.sessionStore[token];
    return true;
  }

  // Query builder
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
            if (f in item) o[f] = item[f];
          });
          return o;
        }));
        return qb as QueryBuilder<any>;
      },
      limit(count: number) {
        chain = chain.then(arr => arr.slice(0, count));
        return qb;
      },
      exec() { return chain; }
    };

    return qb;
  }

  // Export/Import methods
  async exportCollection(collection: string): Promise<string> {
    return JSON.stringify(await this.get(collection), null, 2);
  }

  async importCollection<T = any>(collection: string, json: string, overwrite: boolean = false): Promise<T[]> {
    const arr = JSON.parse(json);
    this.validateSchema(collection, arr[0] || {}); // Validate first item
    
    const base = overwrite ? [] : await this.get(collection);
    const processed = arr.map((it: any, i: number) => ({ uid: crypto.randomUUID(), id: (i + 1).toString(), ...it }));
    
    await this.save(collection, [...base, ...processed]);
    processed.forEach((p: any) => this._audit(collection, p, "insert"));
    
    return processed;
  }

  // Audit logging
  private _audit(collection: string, data: any, action: string): void {
    const logs = this.auditLog[collection] || [];
    logs.push({ action, data, timestamp: Date.now() });
    this.auditLog[collection] = logs.slice(-100); // Keep last 100 entries
  }

  getAuditLog(): Record<string, AuditLogEntry[]> {
    return this.auditLog;
  }

  // System status
  status(): Record<string, any> {
    return {
      owner: this.owner,
      repo: this.repo,
      connected: !!this.token,
      collections: Object.keys(this.schemas),
      initialized: this.initialized,
      queueLength: this.writeQueue.length,
      time: new Date().toISOString(),
    };
  }

  version(): string {
    return "2.0.0";
  }

  isReady(): boolean {
    return this.initialized && !!(this.owner && this.repo && this.token);
  }
}

export default EnhancedUniversalSDK;
export type {
  UniversalSDKConfig,
  User,
  Session,
  QueryBuilder,
  CloudinaryUploadResult,
  MediaAttachment,
  SchemaDefinition
};