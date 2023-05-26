import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { SupportedChain } from 'src/constants/shared';

export class CreatePublicationDto {
  @IsString()
  @IsOptional()
  creatorAddress: string;

  @IsNotEmpty()
  title: string;

  @IsString()
  @MinLength(50)
  description: string;

  @IsString()
  transactionHash: string;

  @IsString()
  @IsOptional()
  chain: SupportedChain;
}
