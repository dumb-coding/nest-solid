type RepositoryOperations<T> = {
  create(entity: T): Promise<T>;
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  update(id: string, patch: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  clear(): Promise<void>;
  close(): Promise<void>;
};

export abstract class BaseInMemoryRepository<T extends { id: string }> {
  protected readonly tableName: string;
  public readonly repository: RepositoryOperations<T>;
  private readonly store = new Map<string, T[]>();

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

  protected async getTable(): Promise<T[]> {
    await Promise.resolve();
    return this.store.get(this.tableName) ?? [];
  }

  protected async saveTable(table: T[]): Promise<void> {
    this.store.set(this.tableName, table);
    await Promise.resolve();
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
    this.store.clear();
    await Promise.resolve();
  }

  protected async closeInternal(): Promise<void> {
    await this.clearInternal();
  }
}
