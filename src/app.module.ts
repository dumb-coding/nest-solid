import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SampleModule } from './modules/sample/sample.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SampleModule,
  ],
})
export class AppModule {}
