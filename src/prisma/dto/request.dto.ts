import { ApiProperty } from '@nestjs/swagger';

export class FindRequestDto<TSelect, TInclude> {
  select?: TSelect;
  include?: TInclude;
}

export class AggregateRequestDto<TWhere, TCursor, TOrderBy> {
  take?: number;
  skip?: number;
  where?: TWhere;
  cursor?: TCursor;
  orderBy?: TOrderBy;
}

export class QueryRequestDto<TWhere, TCursor, TOrderBy, TSelect, TInclude> {
  take?: number;
  skip?: number;
  where?: TWhere;
  cursor?: TCursor;
  orderBy?: TOrderBy;
  select?: TSelect;
  include?: TInclude;
}
