import { ApiExtraModels } from '@nestjs/swagger';
import { CreatePersonDto } from '../../person/dto/create-person.dto';
import { ConnectPersonDto } from '../../person/dto/connect-person.dto';

export class CreateCompanyPeopleRelationInputDto {
  create?: CreatePersonDto[];
  connect?: ConnectPersonDto[];
}

@ApiExtraModels(
  CreatePersonDto,
  ConnectPersonDto,
  CreateCompanyPeopleRelationInputDto,
)
export class CreateCompanyDto {
  name: string;
  people?: CreateCompanyPeopleRelationInputDto;
}
