import {
  ExecutionContext,
  Injectable,
  Logger,
  SetMetadata,
  CanActivate,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from './auth.service';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class JwtAuthGuard implements CanActivate {
  logger: Logger;
  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) {
    this.logger = new Logger('JwtAuthGuard');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();

      const isPublic = this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (isPublic) {
        return true;
      }

      const token = this.extractTokenFromHeader(request);
      if (!token) {
        throw Error('no auth token provided');
      }

      request['user'] =
        await this.authService.getUserFromAuthenticationToken(token);

      return true;
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const bearerToken = request.headers['authorization'];
    const [type, token] = bearerToken ? bearerToken.split(/\s+/) : [];
    return type === 'Bearer' ? token : undefined;
  }
}
