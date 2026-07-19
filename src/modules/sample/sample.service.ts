import { Inject, Injectable } from '@nestjs/common';
import type { SampleRepositoryInterface } from '../../repositories/sample/sample.repository.interface';

export const SAMPLE_REPOSITORY = 'SAMPLE_REPOSITORY';

@Injectable()
export class SampleService {
  constructor(
    @Inject(SAMPLE_REPOSITORY)
    private readonly repository: SampleRepositoryInterface,
  ) {}

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
