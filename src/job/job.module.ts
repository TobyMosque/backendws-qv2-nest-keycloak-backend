import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [],
  controllers: [JobController],
  providers: [PrismaService, JobService],
})
export class JobModule {}
