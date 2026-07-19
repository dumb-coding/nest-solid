import { BaseInMemoryRepository } from '../base.in-memory.repository';
import { SampleEntity } from '../../interfaces/sample.interface';
import { SampleRepositoryInterface } from './sample.repository.interface';

export class SampleInMemoryRepository extends BaseInMemoryRepository<SampleEntity> implements SampleRepositoryInterface {
  constructor() {
    super('sample');
  }

  async create(entity: SampleEntity): Promise<SampleEntity> {
    return this.repository.create(entity);
  }

  async findById(id: string): Promise<SampleEntity | null> {
    return this.repository.findById(id);
  }

  async findAll(): Promise<SampleEntity[]> {
    return this.repository.findAll();
  }

  async update(id: string, patch: Partial<SampleEntity>): Promise<SampleEntity | null> {
    return this.repository.update(id, patch);
  }

  async delete(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }
}
