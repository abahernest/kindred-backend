import { Transform } from 'class-transformer';
import { ToNumber } from './validator';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginationRequestDto {
  @Transform(({ value }) => ToNumber(value, { default: 1, min: 1, max: 50 }))
  @IsNumber()
  @IsOptional()
  public page: number = 1;

  @Transform(({ value }) => ToNumber(value, { default: 10, min: 1, max: 100 }))
  @IsNumber()
  @IsOptional()
  public limit: number = 10;
}

export class PaginationResponseDto<T = unknown> {
  meta: {
    page: number;

    limit: number;

    total: number;
  };

  data: Array<Partial<T>>;
}
