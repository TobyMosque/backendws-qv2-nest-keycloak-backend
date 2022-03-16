import { Prisma } from '@prisma/client';
import { PersonAggregateRequestDto } from './request.dto';

export type PersonAggregateResponseDto = Promise<
  Prisma.GetPersonAggregateType<PersonAggregateRequestDto>
>;
