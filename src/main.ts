import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { LogInterceptor } from './log/log.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('API接口文档')
    .setDescription('api文档')
    .setVersion('1.0')
    .addTag('api')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true // 我们希望只传递预定义（列入白名单）的属性，
  })); // 全局pipe

  app.useGlobalInterceptors(new LogInterceptor())

  app.enableCors()
  
  await app.listen(3000);
}
bootstrap();
