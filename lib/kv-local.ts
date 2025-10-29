// Local in-memory mock for Vercel KV during development
// This allows testing without Vercel KV configured

class LocalKV {
  private storage: Map<string, Map<string, any>>;

  constructor() {
    this.storage = new Map();
  }

  async hgetall<T>(key: string): Promise<Record<string, T> | null> {
    const hash = this.storage.get(key);
    if (!hash) return null;

    const result: Record<string, T> = {};
    hash.forEach((value, field) => {
      result[field] = value;
    });
    return result;
  }

  async hget<T>(key: string, field: string): Promise<T | null> {
    const hash = this.storage.get(key);
    if (!hash) return null;
    return hash.get(field) || null;
  }

  async hset(key: string, fieldValues: Record<string, any>): Promise<number> {
    if (!this.storage.has(key)) {
      this.storage.set(key, new Map());
    }
    const hash = this.storage.get(key)!;

    Object.entries(fieldValues).forEach(([field, value]) => {
      hash.set(field, value);
    });

    return Object.keys(fieldValues).length;
  }

  async hdel(key: string, ...fields: string[]): Promise<number> {
    const hash = this.storage.get(key);
    if (!hash) return 0;

    let deleted = 0;
    fields.forEach(field => {
      if (hash.delete(field)) deleted++;
    });

    return deleted;
  }
}

// Export singleton instance for local development
export const localKV = new LocalKV();
