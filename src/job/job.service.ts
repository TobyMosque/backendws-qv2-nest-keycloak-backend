import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JobQueryRequestDto, JobFindRequestDto } from './dto/request.dto';
import { Job } from './entities';
import { CreateJobDto, UpdateJobDto } from './dto';
import { JobQueryResponseDto } from './dto/response.dto';

@Injectable()
export class JobService {
  constructor(private prisma: PrismaService) {}

  find(id: string, params: JobFindRequestDto): Promise<Job> {
    if (params.select && params.include) {
      delete params.include;
    }
    return this.prisma.job.findFirst({
      where: {
        jobId: id,
      },
      ...params,
    });
  }

  async query(
    params: JobQueryRequestDto,
    count?: boolean,
  ): Promise<JobQueryResponseDto> {
    if (params.select && params.include) {
      delete params.include;
    }
    const result: JobQueryResponseDto = { data: [] };
    result.data = await this.prisma.job.findMany(params);
    if (count) {
      const { cursor, where } = params;
      result.count = await this.prisma.job.count({ cursor, where });
    }
    return result;
  }

  create(data: CreateJobDto): Promise<Job> {
    return this.prisma.job.create({ data });
  }

  async update(
    id: string,
    data: UpdateJobDto,
    rev?: string,
  ): Promise<Job | HttpStatus> {
    const status = await this.checkRev(id, rev);
    if (status !== HttpStatus.OK) {
      return status;
    }
    return this.prisma.job.update({
      where: {
        jobId: id,
      },
      data,
    });
  }

  async delete(id: string, rev?: string): Promise<Job | HttpStatus> {
    const status = await this.checkRev(id, rev);
    if (status !== HttpStatus.OK) {
      return status;
    }
    return this.prisma.job.delete({
      where: {
        jobId: id,
      },
    });
  }

  async checkRev(id: string, rev?: string): Promise<HttpStatus> {
    if (rev) {
      const { revision } = await this.find(id, {
        select: {
          revision: true,
        },
      });
      if (revision !== rev) {
        return HttpStatus.CONFLICT;
      }
    }
    return HttpStatus.OK;
  }
}
