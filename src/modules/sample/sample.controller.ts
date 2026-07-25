/**
 * HTTP controller for sample endpoints.
 *
 * Delegates business logic to the sample service.
 */
import { Controller, Get } from '@nestjs/common';
import { SampleService } from './sample.service';

@Controller()
export class SampleController {
  constructor(private readonly service: SampleService) {}

  /**
   * GET /
   * Returns a sample title obtained from the service layer.
   */
  @Get()
  async getSample(): Promise<string> {
    return this.service.getSample();
  }
}
