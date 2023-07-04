import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);
  const host: string = configService.get<string>('APP_HOST');
  const port: number = configService.get<number>('APP_PORT');
  await app.listen(port, () => {
    Logger.log(`[NEWS-SERVICE]: is listening ${host}:${port}`);
  });
}

bootstrap();
