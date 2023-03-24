import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import 'dotenv/config';
import { AppModule } from './app.module';
import { startPolyglot } from './polyglot';

const { PORT = 3000, API_VERSION = 'v1' } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix(API_VERSION);
  app.use(startPolyglot);

  const options = new DocumentBuilder()
    .setTitle(`WriteHouse Backend`)
    .setDescription(`The WriteHouse Backend is an API that serves a Web 3 blog web app`)
    .setVersion('1.0')
    .addTag('WriteHouse-API')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(`${API_VERSION}/doc-api`, app, document);
  await app.listen(PORT);
  Logger.log(`Server running on http://localhost:${PORT}`);
}
bootstrap();
