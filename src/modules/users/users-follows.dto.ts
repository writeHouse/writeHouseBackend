import { IsString } from 'class-validator';

export class UserFollowDto {
  @IsString()
  walletAddress: string;

  @IsString()
  signature: string;
}
