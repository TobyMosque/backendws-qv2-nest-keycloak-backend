import { Express, Request, Response } from 'express';
import { NestFactory } from '@nestjs/core';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

interface RenderParams {
  req: Request;
  res: Response;
}

type RenderFn = (params: RenderParams) => Promise<void>;
interface ConfigureParams {
  app: Express;
  prefix: string;
  render?: RenderFn;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly prefix: string,
    private readonly render?: RenderFn,
  ) {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();
    const status = exception.getStatus() as number;
    if (status === 404 && !req.path.startsWith(this.prefix) && this.render) {
      await this.render({ req, res });
    } else {
      res.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: req.url,
      });
    }
  }
}

export default async function bootstrap({
  app: server,
  prefix,
  render,
}: ConfigureParams) {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.setGlobalPrefix(prefix);
  app.useGlobalFilters(new HttpExceptionFilter(prefix, render));

  const config = new DocumentBuilder()
    .setTitle('Quasar Nest example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${prefix}/docs`, app, document);
  return app;
}
