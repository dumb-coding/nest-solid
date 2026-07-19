import { Test, TestingModule } from '@nestjs/testing';
import { SampleInMemoryRepository } from '../../repositories/sample/sample.in-memory.repository';
import { SampleRedisRepository } from '../../repositories/sample/sample.redis.repository';
import { SampleRepositoryInterface } from '../../repositories/sample/sample.repository.interface';
import { SAMPLE_REPOSITORY, SampleService } from './sample.service';

const getRepositoryProvider = () => ({
  provide: SAMPLE_REPOSITORY,
  useClass:
    process.env.INTEGRATION_MODE === 'true'
      ? SampleRedisRepository
      : SampleInMemoryRepository,
});

describe('SampleService', () => {
  let service: SampleService;
  let module: TestingModule;
  let repository: SampleRepositoryInterface;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [SampleService, getRepositoryProvider()],
    }).compile();

    service = module.get<SampleService>(SampleService);
    repository = module.get<SampleRepositoryInterface>(SAMPLE_REPOSITORY);
    await repository.clear();
  });

  afterEach(async () => {
    await repository.close();
    await module.close();
  });

  it('creates and returns a sample entry when none exists', async () => {
    await expect(service.getSample()).resolves.toBe('Sample World!');

    const repository = module.get<SampleRepositoryInterface>(SAMPLE_REPOSITORY);
    await expect(repository.findAll()).resolves.toEqual([
      { id: 'sample-1', title: 'Sample World!' },
    ]);
  });

  it('returns the first stored sample entry when data already exists', async () => {
    const repository = module.get<SampleRepositoryInterface>(SAMPLE_REPOSITORY);
    await repository.create({ id: 'sample-2', title: 'Existing sample' });

    await expect(service.getSample()).resolves.toBe('Existing sample');
    await expect(repository.findAll()).resolves.toEqual([
      { id: 'sample-2', title: 'Existing sample' },
    ]);
  });
});
