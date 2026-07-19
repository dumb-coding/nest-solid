import { Module } from '@nestjs/common';
import { SampleRedisRepository } from '../../repositories/sample/sample.redis.repository';
import { SampleController } from './sample.controller';
import { SampleService, SAMPLE_REPOSITORY } from './sample.service';

@Module({
  controllers: [SampleController],
  providers: [
    SampleService,
    {
      provide: SAMPLE_REPOSITORY,
      useClass: SampleRedisRepository,
    },
  ],
})
export class SampleModule {}
