import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class JwtPayload {
  sub: number; // id
}

export class CurrentUser {
  id: number;
  email: string;
}

export class LoginResponse {
  access_token: string;

  user: { id: number; email: string };
}
