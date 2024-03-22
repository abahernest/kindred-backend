import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CurrentUser, JwtPayload } from './dto/auth.dto';
import { UserService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  public async getUserFromAuthenticationToken(
    token: string,
  ): Promise<CurrentUser> {
    const payload: JwtPayload = this.jwtService.verify(token, {
      secret: this.configService.get('JWT_SECRET'),
    });

    if (!payload) {
      throw new UnauthorizedException('invalid token');
    }

    const user = await this.usersService.findById(payload?.sub);
    if (!user) {
      throw new UnauthorizedException('user not found');
    }
    return { id: user.id, email: user.email };
  }
}
