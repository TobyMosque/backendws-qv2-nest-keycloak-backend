import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AuthModule } from './auth/auth.module';
import { JobModule } from './job/job.module';
import { CompanyModule } from './company/company.module';
import { PersonModule } from './person/person.module';
import { INestApplication } from '@nestjs/common';

interface GetOpenApiSpecParams {
  app?: INestApplication;
}

export async function getOpenApiSpec({ app }: GetOpenApiSpecParams = {}) {
  const config = new DocumentBuilder()
    .setTitle('Quasar Nest example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();
  return SwaggerModule.createDocument(app, config, {
    include: [AuthModule, JobModule, CompanyModule, PersonModule],
    operationIdFactory(controllerKey, methodKey) {
      return methodKey;
    },
  });
}
