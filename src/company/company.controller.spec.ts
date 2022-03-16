import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';

describe('CompanyController', () => {
  let companyController: CompanyController;

  beforeEach(async () => {
    const company: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [CompanyService],
    }).compile();

    companyController = company.get<CompanyController>(CompanyController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      // expect(companyController.getHello()).toBe('Hello World!');
    });
  });
});
