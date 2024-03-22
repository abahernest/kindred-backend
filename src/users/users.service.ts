import { Injectable } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';
import { CreateUserDto } from './dto/user.dto';
import { UserEntity } from './entities/user.entity';
import { PaginationRequestDto } from '../utils/types';

@Injectable()
export class UserService {
  constructor() {}

  async create(payload: CreateUserDto) {
    return await UserEntity.save(payload);
  }

  async findById(id: number): Promise<UserEntity> {
    return UserEntity.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return UserEntity.findOne({ where: { email } });
  }

  async count(filter?: Partial<UserEntity>) {
    return UserEntity.count(filter as FindManyOptions<UserEntity>);
  }

  async getAll({ limit, page }: PaginationRequestDto) {
    return UserEntity.query(
      `
          SELECT
              id,
              email,
              created_at
          FROM
              users
          ORDER BY created_at DESC
          LIMIT $1
          OFFSET $2;
    `,
      [limit, limit * --page],
    );
  }
}
