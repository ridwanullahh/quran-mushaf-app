import UniversalSDK, { UniversalSDKConfig, User, QueryBuilder, Session } from '../../githubdb-sdk';

interface EnhancedUniversalSDK extends UniversalSDK {
  // Enhanced methods for the Quran database
  create<T = any>(collection: string, item: Partial<T>): Promise<T>;
  bulkCreate<T = any>(collection: string, items: Partial<T>[]): Promise<T[]>;
  queryBuilder<T = any>(collection: string): QueryBuilder<T>;
  register(email: string, password: string, userData?: any): Promise<User>;
  login(email: string, password: string): Promise<string | { otpRequired: boolean }>;
  getUser(id: string): Promise<User | null>;
  update<T = any>(collection: string, key: string, updates: Partial<T>): Promise<T>;
  delete(collection: string, key: string): Promise<void>;
  get<T = any>(collection: string): Promise<T[]>;
  getItem<T = any>(collection: string, key: string): Promise<T | null>;
}

class EnhancedUniversalSDKImpl extends UniversalSDK implements EnhancedUniversalSDK {
  async create<T = any>(collection: string, item: Partial<T>): Promise<T> {
    return this.insert<T>(collection, item);
  }

  async bulkCreate<T = any>(collection: string, items: Partial<T>[]): Promise<T[]> {
    return this.bulkInsert<T>(collection, items);
  }
}

export { EnhancedUniversalSDKImpl as EnhancedUniversalSDK };
export type { EnhancedUniversalSDK };
export default EnhancedUniversalSDKImpl;