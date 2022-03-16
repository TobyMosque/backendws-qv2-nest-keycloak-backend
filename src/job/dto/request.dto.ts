import { Prisma } from '@prisma/client';
import {
  FindRequestDto,
  AggregateRequestDto,
  QueryRequestDto,
} from 'src/prisma/dto/request.dto';

export class JobFindRequestDto extends FindRequestDto<
  Prisma.JobSelect,
  Prisma.JobInclude
> {}

export class JobAggregateRequestDto extends AggregateRequestDto<
  Prisma.JobWhereInput,
  Prisma.JobWhereUniqueInput,
  Prisma.JobOrderByWithRelationInput
> {}

export class JobQueryRequestDto extends QueryRequestDto<
  Prisma.JobWhereInput,
  Prisma.JobWhereUniqueInput,
  Prisma.JobOrderByWithRelationInput,
  Prisma.JobSelect,
  Prisma.JobInclude
> {}
