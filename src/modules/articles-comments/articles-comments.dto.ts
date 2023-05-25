import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  body: string;

  @IsNumber()
  baseID: string;

  @IsString()
  walletAddress: string;
}

export class UpdateCommentDto {
  @IsString()
  body: string;

  @IsString()
  walletAddress: string;
}
