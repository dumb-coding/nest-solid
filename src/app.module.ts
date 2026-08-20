/**
 * Root application module that wires global config and feature modules.
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SampleModule } from './modules/sample/sample.module';

@Module({
  imports: [
    // Load environment variables globally for the application
    // Reference for ConfigModule: https://docs.nestjs.com/techniques/configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SampleModule,
  ],
})
export class AppModule {}
