import { Company } from '../entities';
import { ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels(Company)
export class CompanyQueryResponseDto {
  data: Company[];
  count?: number;
}
