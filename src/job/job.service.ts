import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  JobQueryRequestDto,
  JobAggregateRequestDto,
  JobFindRequestDto,
} from './dto/request.dto';
import { JobAggregateResponseDto } from './dto/response.dto';
import { Job } from './entities';
import { CreateJobDto, UpdateJobDto } from './dto';

@Injectable()
export class JobService {
  constructor(private prisma: PrismaService) {}

  find(id: string, params: JobFindRequestDto): Promise<Job> {
    if (params.select && params.include) {
      delete params.include;
    }
    return this.prisma.job.findUnique({
      where: {
        jobId: id,
      },
      ...params,
    });
  }

  query(params: JobQueryRequestDto): Promise<Job[]> {
    if (params.select && params.include) {
      delete params.include;
    }
    return this.prisma.job.findMany(params);
  }

  aggregate(params: JobAggregateRequestDto): JobAggregateResponseDto {
    return this.prisma.job.aggregate(params);
  }

  create(data: CreateJobDto): Promise<Job> {
    return this.prisma.job.create({ data });
  }

  update(id: string, data: UpdateJobDto): Promise<Job> {
    return this.prisma.job.update({
      where: {
        jobId: id,
      },
      data,
    });
  }

  delete(id: string): Promise<Job> {
    return this.prisma.job.delete({
      where: {
        jobId: id,
      },
    });
  }
}
