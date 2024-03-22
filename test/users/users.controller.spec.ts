import { Test } from '@nestjs/testing';
import { UsersController } from '../../src/users/users.controller';
import { UserService } from '../../src/users/users.service';
import { CreateUserDto } from '../../src/users/dto/user.dto';
import { userStub, userStub1 } from './stubs/users.stub';
import { UserEntity } from '../../src/users/entities/user.entity';
import { PasswordUtilService } from '../../src/utils/password.util.service';
import {
  PaginationRequestDto,
  PaginationResponseDto,
} from '../../src/utils/types';

jest.mock('../../src/users/users.service');
jest.mock('../../src/auth/auth.service');
jest.mock('../../src/utils/password.util.service');

describe('UsersController (unit)', () => {
  let usersController: UsersController;
  let usersService: UserService;
  let passwordUtilService: PasswordUtilService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UserService, PasswordUtilService],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UserService>(UserService);
    passwordUtilService = module.get<PasswordUtilService>(PasswordUtilService);
  });

  describe('register()', () => {
    let signupResponse, createUserDto: CreateUserDto;

    beforeEach(async () => {
      jest
        .spyOn(passwordUtilService, 'hashPassword')
        .mockReturnValueOnce('password hash');
      jest
        .spyOn(usersService, 'create')
        .mockResolvedValueOnce(userStub() as UserEntity);

      createUserDto = {
        email: userStub().email,
        password: userStub().password,
      };

      signupResponse = await usersController.register(createUserDto);
    });

    test('then it should call usersService.create() with CreateUserDto type', () => {
      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(usersService.create).toHaveBeenCalledTimes(1);
    });

    test('then it should call passwordService.hashPassword() with un-hashed password from payload', () => {
      expect(passwordUtilService.hashPassword).toHaveBeenCalledWith(
        userStub().password,
      );
      expect(passwordUtilService.hashPassword).toHaveBeenCalledTimes(1);
    });

    test('should return only email and user id', () => {
      expect(signupResponse.id).toEqual(userStub().id);
      expect(signupResponse.email).toEqual(userStub().email);
      expect(Object.keys(signupResponse).length).toEqual(2);
    });
  });

  describe('fetchAllUsers()', () => {
    const paginationQuery: PaginationRequestDto = { page: 1, limit: 10 };
    let paginationResponse: PaginationResponseDto;

    beforeEach(async () => {
      jest.spyOn(usersService, 'count').mockResolvedValueOnce(2);
      jest
        .spyOn(usersService, 'getAll')
        .mockResolvedValueOnce([userStub(), userStub1()] as UserEntity[]);

      paginationResponse = await usersController.fetchAllUsers(paginationQuery);
    });

    test('then it should call usersService.count()', () => {
      expect(usersService.count).toHaveBeenCalledWith();
      expect(usersService.count).toHaveBeenCalledTimes(1);
    });

    test('then it should call usersService.getAll()', () => {
      expect(usersService.getAll).toHaveBeenCalledWith(paginationQuery);
      expect(usersService.getAll).toHaveBeenCalledTimes(1);
    });

    test('should return PaginationResponseDto type', () => {
      expect(paginationQuery.limit).toEqual(paginationResponse.meta.limit);
      expect(paginationQuery.page).toEqual(paginationResponse.meta.page);

      expect(paginationResponse.data.length).toBeLessThanOrEqual(
        paginationQuery.limit,
      );
    });
  });
});
