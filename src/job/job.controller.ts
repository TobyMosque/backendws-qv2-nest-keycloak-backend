import {
  Body,
  Get,
  Controller,
  Param,
  Query,
  Put,
  Delete,
} from '@nestjs/common';
import { JobService } from './job.service';
import {
  JobFindRequestDto,
  JobQueryRequestDto,
  JobAggregateRequestDto,
} from './dto/request.dto';
import { JobAggregateResponseDto } from './dto/response.dto';
import { ApiTags } from '@nestjs/swagger';
import { Job } from './entities';
import { CreateJobDto, UpdateJobDto } from './dto';

@ApiTags('job')
@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get(':id')
  find(
    @Param('id') id: string,
    @Query() params: JobFindRequestDto,
  ): Promise<Job> {
    return this.jobService.find(id, params);
  }

  @Get()
  query(@Query() params: JobQueryRequestDto): Promise<Job[]> {
    return this.jobService.query(params);
  }

  @Get('aggregate')
  aggregate(@Query() params: JobAggregateRequestDto): JobAggregateResponseDto {
    return this.jobService.aggregate(params);
  }

  @Put()
  update(@Body() data: CreateJobDto): Promise<Job> {
    return this.jobService.create(data);
  }

  @Put(':id')
  insert(@Param('id') id: string, @Body() data: UpdateJobDto): Promise<Job> {
    return this.jobService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<Job> {
    return this.jobService.delete(id);
  }
}
