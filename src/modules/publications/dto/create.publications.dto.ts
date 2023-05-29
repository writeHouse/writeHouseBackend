import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { SupportedChain } from 'src/constants/shared';

export class CreatePublicationDto {
  @IsString()
  @IsNotEmpty()
  creatorAddress: string;

  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsString()
  transactionHash: string;

  @IsString()
  @IsOptional()
  chain: SupportedChain;
}
