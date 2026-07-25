/**
 * Sample feature module.
 *
 * Configures the controller and binds the repository implementation token.
 */
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
      useClass: SampleRedisRepository, // Default repository implementation used at runtime.
    },
  ],
})
export class SampleModule {}
