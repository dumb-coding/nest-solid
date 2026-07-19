import { Test, TestingModule } from '@nestjs/testing';
import { SampleInMemoryRepository } from '../../repositories/sample/sample.in-memory.repository';
import { SampleRedisRepository } from '../../repositories/sample/sample.redis.repository';
import { SampleController } from './sample.controller';
import { SampleRepositoryInterface } from '../../repositories/sample/sample.repository.interface';
import { SAMPLE_REPOSITORY, SampleService } from './sample.service';

const getRepositoryProvider = () => ({
  provide: SAMPLE_REPOSITORY,
  useClass:
    process.env.INTEGRATION_MODE === 'true'
      ? SampleRedisRepository
      : SampleInMemoryRepository,
});

describe('SampleController', () => {
  let controller: SampleController;
  let module: TestingModule;
  let repository: SampleRepositoryInterface;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [SampleController],
      providers: [SampleService, getRepositoryProvider()],
    }).compile();

    controller = module.get<SampleController>(SampleController);
    repository = module.get<SampleRepositoryInterface>(SAMPLE_REPOSITORY);
    await repository.clear();
  });

  afterEach(async () => {
    await repository.close();
    await module.close();
  });

  it('returns the sample value from the service', async () => {
    await expect(controller.getSample()).resolves.toBe('Sample World!');
  });
});
