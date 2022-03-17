import { ApiExtraModels } from '@nestjs/swagger';
import { CreatePersonDto } from '../../person/dto/create-person.dto';
import { ConnectPersonDto } from '../../person/dto/connect-person.dto';

export class UpdateCompanyPeopleRelationInputDto {
  create?: CreatePersonDto[];
  connect?: ConnectPersonDto[];
}

@ApiExtraModels(
  CreatePersonDto,
  ConnectPersonDto,
  UpdateCompanyPeopleRelationInputDto,
)
export class UpdateCompanyDto {
  name?: string;
  people?: UpdateCompanyPeopleRelationInputDto;
}
