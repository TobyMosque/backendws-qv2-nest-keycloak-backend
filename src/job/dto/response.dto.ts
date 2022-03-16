import { Prisma } from '@prisma/client';
import { JobAggregateRequestDto } from './request.dto';

export type JobAggregateResponseDto = Promise<
  Prisma.GetJobAggregateType<JobAggregateRequestDto>
>;
