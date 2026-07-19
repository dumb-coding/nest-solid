import { SampleEntity } from '../../interfaces/sample.interface';

export type { SampleEntity } from '../../interfaces/sample.interface';

export interface SampleRepositoryInterface {
  create(entity: SampleEntity): Promise<SampleEntity>;
  findById(id: string): Promise<SampleEntity | null>;
  findAll(): Promise<SampleEntity[]>;
  update(id: string, patch: Partial<SampleEntity>): Promise<SampleEntity | null>;
  delete(id: string): Promise<boolean>;
}
