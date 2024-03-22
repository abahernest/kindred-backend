import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/user.dto';
import { Public } from '../auth/jwt-auth.guard';
import { ErrorLogger } from '../utils/errors';
import { PaginationRequestDto, PaginationResponseDto } from '../utils/types';
import { PasswordUtilService } from '../utils/password.util.service';

@Controller({ version: '1', path: 'users' })
export class UsersController {
  logger: ErrorLogger;
  constructor(
    private readonly passwordService: PasswordUtilService,
    private readonly usersService: UserService,
  ) {
    this.logger = new ErrorLogger('UsersController');
  }

  @Public()
  @Post('register')
  async register(@Body() payload: CreateUserDto) {
    try {
      payload.password = this.passwordService.hashPassword(payload.password);
      const user = await this.usersService.create(payload);

      return {
        id: user.id,
        email: user.email,
      };
    } catch (err) {
      this.logger.handleError(
        'an error occurred while creating user account',
        err,
      );
    }
  }

  @Get('')
  async fetchAllUsers(
    @Query() query: PaginationRequestDto,
  ): Promise<PaginationResponseDto> {
    try {
      return {
        meta: {
          limit: Number(query.limit),
          page: Number(query.page),
          total: await this.usersService.count(),
        },
        data: await this.usersService.getAll(query),
      };
    } catch (e) {
      this.logger.handleError(
        `an error occurred while fetching all users for admin`,
        e,
      );
    }
  }
}
