import { Controller, Post, Body } from '@nestjs/common';
import { LoginDto, JwtPayload, LoginResponse } from './dto/auth.dto';
import { Public } from './jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { ErrorLogger } from '../utils/errors';
import { PasswordUtilService } from '../utils/password.util.service';
import { UserService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Controller({ version: '1', path: 'auth' })
export class AuthController {
  logger: ErrorLogger;
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly passwordUtilService: PasswordUtilService,
  ) {
    this.logger = new ErrorLogger('AuthController');
  }

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    try {
      const user = await this.usersService.findByEmail(loginDto.email);

      if (user) {
        if (
          this.passwordUtilService.correctPassword(
            loginDto.password,
            user.password,
          )
        ) {
          const payload: JwtPayload = { sub: user.id };

          return {
            access_token: this.jwtService.sign(payload, {
              secret: this.configService.get('JWT_SECRET'),
            }),
            user: {
              id: user.id,
              email: user.email,
            },
          };
        }
      }

      throw new Error('400:-Bad Request:-wrong user credentials');
    } catch (e) {
      this.logger.handleError(`an error occurred during client login`, e);
    }
  }
}
