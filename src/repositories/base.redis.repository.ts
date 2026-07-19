import { createClient } from 'redis';

type RepositoryOperations<T> = {
  create(entity: T): Promise<T>;
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  update(id: string, patch: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  clear(): Promise<void>;
  close(): Promise<void>;
};

export abstract class BaseRedisRepository<T extends { id: string }> {
  protected readonly tableName: string;
  public readonly repository: RepositoryOperations<T>;
  private client: ReturnType<typeof createClient> | null = null;

  constructor(tableName: string) {
    const prefix = process.env.TABLE_PREFIX ?? '';
    this.tableName = `${prefix}${tableName}`;
    this.repository = {
      create: (entity: T) => this.createInternal(entity),
      findById: (id: string) => this.findByIdInternal(id),
      findAll: () => this.findAllInternal(),
      update: (id: string, patch: Partial<T>) => this.updateInternal(id, patch),
      delete: (id: string) => this.deleteInternal(id),
      clear: () => this.clearInternal(),
      close: () => this.closeInternal(),
    };
  }

  protected serializeTable(table: T[]): string {
    return JSON.stringify(table);
  }

  protected deserializeTable(value: string): T[] {
    return JSON.parse(value) as T[];
  }

  protected async createClient(): Promise<ReturnType<typeof createClient>> {
    const redisUrl = process.env.REDIS_URL ?? 'redis://127.0.0.1:6379';
    const client = createClient({ url: redisUrl });

    client.on('error', (error: Error) => {
      console.error('Redis client error', error);
    });

    await client.connect();
    return client;
  }

  protected async getClient(): Promise<ReturnType<typeof createClient>> {
    if (!this.client) {
      this.client = await this.createClient();
    }

    return this.client;
  }

  protected async setValue(key: string, value: string): Promise<void> {
    const client = await this.getClient();
    await client.set(key, value);
  }

  protected async getValue(key: string): Promise<string | null> {
    const client = await this.getClient();
    return client.get(key);
  }

  protected async deleteValue(key: string): Promise<number> {
    const client = await this.getClient();
    return client.del(key);
  }

  protected async getTable(): Promise<T[]> {
    const value = await this.getValue(this.tableName);
    if (!value) {
      return [];
    }

    return this.deserializeTable(value);
  }

  protected async saveTable(table: T[]): Promise<void> {
    await this.setValue(this.tableName, this.serializeTable(table));
  }

  protected cloneEntity(entity: T): T {
    return { ...entity };
  }

  protected cloneTable(table: T[]): T[] {
    return table.map((entity) => this.cloneEntity(entity));
  }

  protected async createInternal(entity: T): Promise<T> {
    const table = await this.getTable();
    const index = table.findIndex((item) => item.id === entity.id);
    const nextTable = [...table];

    if (index >= 0) {
      nextTable[index] = this.cloneEntity(entity);
    } else {
      nextTable.push(this.cloneEntity(entity));
    }

    await this.saveTable(nextTable);
    return this.cloneEntity(entity);
  }

  protected async findByIdInternal(id: string): Promise<T | null> {
    const entity = (await this.getTable()).find((item) => item.id === id);
    return entity ? this.cloneEntity(entity) : null;
  }

  protected async findAllInternal(): Promise<T[]> {
    return this.cloneTable(await this.getTable());
  }

  protected async updateInternal(
    id: string,
    patch: Partial<T>,
  ): Promise<T | null> {
    const table = await this.getTable();
    const index = table.findIndex((item) => item.id === id);

    if (index < 0) {
      return null;
    }

    const updated = { ...table[index], ...patch };
    const nextTable = [...table];
    nextTable[index] = updated;

    await this.saveTable(nextTable);
    return this.cloneEntity(updated);
  }

  protected async deleteInternal(id: string): Promise<boolean> {
    const table = await this.getTable();
    const nextTable = table.filter((item) => item.id !== id);

    if (nextTable.length === table.length) {
      return false;
    }

    await this.saveTable(nextTable);
    return true;
  }

  public async clear(): Promise<void> {
    await this.clearInternal();
  }

  public async close(): Promise<void> {
    await this.closeInternal();
  }

  protected async clearInternal(): Promise<void> {
    const client = await this.getClient();
    await client.flushAll();
  }

  protected async closeInternal(): Promise<void> {
    if (!this.client) {
      return;
    }

    const client = this.client;
    this.client = null;

    try {
      await client.quit();
    } catch {
      try {
        await client.disconnect();
      } catch {
        // ignore cleanup errors
      }
    }
  }
}
