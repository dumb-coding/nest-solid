/**
 * Injection token for the sample repository.
 *
 * Used by the service to obtain a repository implementation at runtime.
 */
import { Inject, Injectable } from '@nestjs/common';
import type { SampleRepositoryInterface } from '../../repositories/sample/sample.repository.interface';

export const SAMPLE_REPOSITORY = 'SAMPLE_REPOSITORY';

/**
 * Application service for sample-related business logic.
 *
 * This layer is intentionally slim and delegates persistence to the repository.
 */
@Injectable()
export class SampleService {
  constructor(
    @Inject(SAMPLE_REPOSITORY)
    private readonly repository: SampleRepositoryInterface,
  ) {}

  /**
   * Returns the first sample title in storage, or creates a default sample if none exists.
   */
  async getSample(): Promise<string> {
    const existingSamples = await this.repository.findAll();

    if (existingSamples.length > 0) {
      return existingSamples[0].title;
    }

    const created = await this.repository.create({
      id: 'sample-1',
      title: 'Sample World!',
    });

    return created.title;
  }
}
