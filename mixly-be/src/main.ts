import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { GraphQLExceptionFilter } from './common/filters/graphql-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  
  app.useGlobalFilters(new GraphQLExceptionFilter());
  
  app.enableCors();
  
  await app.listen(4000);
  console.log(`Application is running on: http://localhost:4000/graphql`);
}
bootstrap();
