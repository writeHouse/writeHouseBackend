import { IsString, IsOptional } from 'class-validator';

export class UserUpdateProfileDto {
  @IsString()
  readonly walletAddress: string;

  @IsString()
  @IsOptional()
  readonly username: string;

  @IsString()
  @IsOptional()
  readonly fullName: string;

  @IsString()
  @IsOptional()
  readonly email: string;

  @IsString()
  @IsOptional()
  readonly userBio: string;

  @IsString()
  @IsOptional()
  readonly userAvatarUrl: string;

  @IsString()
  @IsOptional()
  readonly userAvatarUrlCompressed: string;

  @IsString()
  @IsOptional()
  readonly userAvatarUrlThumbnail: string;

  @IsString()
  @IsOptional()
  readonly coverUrl: string;

  @IsString()
  @IsOptional()
  readonly coverThumbnailUrl: string;

  @IsString()
  @IsOptional()
  readonly socialUrl: string;

  @IsString()
  @IsOptional()
  readonly twitterUrl: string;

  @IsString()
  @IsOptional()
  readonly linkedinUrl: string;

  @IsString()
  signature: string;
}
