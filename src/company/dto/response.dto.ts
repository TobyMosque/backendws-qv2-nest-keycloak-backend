import { Prisma } from '@prisma/client';
import { CompanyAggregateRequestDto } from './request.dto';

export type CompanyAggregateResponseDto = Promise<
  Prisma.GetCompanyAggregateType<CompanyAggregateRequestDto>
>;
