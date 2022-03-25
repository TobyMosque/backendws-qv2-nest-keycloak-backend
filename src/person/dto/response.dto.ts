import { Person } from '../entities';
import { ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels(Person)
export class PersonQueryResponseDto {
  data: Person[];
  count?: number;
}
