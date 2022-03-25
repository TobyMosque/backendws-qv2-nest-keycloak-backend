import {
  Body,
  Get,
  Controller,
  Param,
  Query,
  Put,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JobService } from './job.service';
import { JobQueryRequestDto, JobFindRequestDto } from './dto/request.dto';
import { ApiQuery, ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Job } from './entities';
import { CreateJobDto, UpdateJobDto } from './dto';
import { QueryObjectTrasform } from 'src/pipes/object.transform';
import { JobQueryResponseDto } from './dto/response.dto';

@ApiTags('job')
@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get(':id')
  find(
    @Param('id') id: string,
    @Query(QueryObjectTrasform) params: JobFindRequestDto,
  ): Promise<Job> {
    return this.jobService.find(id, params);
  }

  @Get()
  @ApiQuery({ name: 'count', required: false })
  @ApiOkResponse({ type: () => JobQueryResponseDto })
  query(
    @Query(QueryObjectTrasform) params: JobQueryRequestDto,
    @Query('count') count?: boolean,
  ): Promise<JobQueryResponseDto> {
    return this.jobService.query(params, count);
  }

  @Put()
  create(@Body() data: CreateJobDto): Promise<Job> {
    return this.jobService.create(data);
  }

  @Put(':id')
  @ApiQuery({ name: 'rev', required: false })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateJobDto,
    @Query('rev') rev?: string,
  ): Promise<Job> {
    const result = await this.jobService.update(id, data, rev);
    if (typeof result === 'number') {
      throw new HttpException(HttpStatus[result], result);
    }
    return result;
  }

  @Delete(':id')
  @ApiQuery({ name: 'rev', required: false })
  async delete(
    @Param('id') id: string,
    @Query('rev') rev?: string,
  ): Promise<Job> {
    const result = await this.jobService.delete(id, rev);
    if (typeof result === 'number') {
      throw new HttpException(HttpStatus[result], result);
    }
    return result;
  }
}
