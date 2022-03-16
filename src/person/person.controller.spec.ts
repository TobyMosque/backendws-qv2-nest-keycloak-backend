import { Test, TestingModule } from '@nestjs/testing';
import { PersonController } from './person.controller';
import { PersonService } from './person.service';

describe('PersonController', () => {
  let personController: PersonController;

  beforeEach(async () => {
    const person: TestingModule = await Test.createTestingModule({
      controllers: [PersonController],
      providers: [PersonService],
    }).compile();

    personController = person.get<PersonController>(PersonController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      // expect(personController.getHello()).toBe('Hello World!');
    });
  });
});
