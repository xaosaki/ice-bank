import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RequestMethod } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api', {
    exclude: [
      { path: 'metrics', method: RequestMethod.GET },
      { path: 'health', method: RequestMethod.GET },
      { path: 'ready', method: RequestMethod.GET }
    ]
  });

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API documentation Ice-Split')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true
    }
  });

  await app.listen(parseInt(process.env.PORT || '3000', 10));
}
bootstrap();
