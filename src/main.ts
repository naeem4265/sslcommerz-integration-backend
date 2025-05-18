import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  
  // Enable CORS
  app.enableCors();
  logger.log('CORS enabled');
  
  // Add global prefix
  app.setGlobalPrefix('api/v1');
  logger.log('Global prefix set to: api/v1');
  
  // Enable validation pipes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  logger.log('Global validation pipe enabled');

  // Setup Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Alumni Get Together API')
    .setDescription('API documentation for Alumni Get Together registration system')
    .setVersion('1.0')
    .addTag('registration')
    .addTag('payment')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/swagger', app, document);
  logger.log('Swagger documentation setup complete');

  await app.listen(3002);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap(); 