import { Controller, Get } from '@nestjs/common';
import { SampleService } from './sample.service';

@Controller()
export class SampleController {
  constructor(private readonly service: SampleService) {}

  @Get()
  async getSample(): Promise<string> {
    return this.service.getSample();
  }
}
