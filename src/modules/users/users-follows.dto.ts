import { IsString } from "class-validator";

export class UsersFollowsWalletDto {
  @IsString()
  walletAddress: string; 

  @IsString()
  signature: string;
}