import { BaseRedisRepository } from '../base.redis.repository';
import { SampleEntity } from '../../interfaces/sample.interface';
import { SampleRepositoryInterface } from './sample.repository.interface';

export class SampleRedisRepository
  extends BaseRedisRepository<SampleEntity>
  implements SampleRepositoryInterface
{
  constructor() {
    super('sample');
  }

  async create(entity: SampleEntity): Promise<SampleEntity> {
    return await this.repository.create(entity);
  }

  async findById(id: string): Promise<SampleEntity | null> {
    return await this.repository.findById(id);
  }

  async findAll(): Promise<SampleEntity[]> {
    return await this.repository.findAll();
  }

  async update(
    id: string,
    patch: Partial<SampleEntity>,
  ): Promise<SampleEntity | null> {
    return await this.repository.update(id, patch);
  }

  async delete(id: string): Promise<boolean> {
    return await this.repository.delete(id);
  }
}
