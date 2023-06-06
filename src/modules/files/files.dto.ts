import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { FileTypeEnum, ResourceType } from '../../constants/shared';

export class GetUploadSignedUrl {
  @ApiProperty({ example: '0xB371E951840f5801246F9A503A861E5B30dFF363' })
  @IsString()
  readonly walletAddress: string;

  @ApiProperty({ enum: FileTypeEnum, example: 'image/jpeg' })
  @IsEnum(FileTypeEnum)
  @Transform(({ value }) => value as FileTypeEnum)
  readonly fileType: FileTypeEnum;

  @ApiProperty({ enum: ResourceType, example: 'user' })
  @IsEnum(ResourceType)
  readonly resourceType: ResourceType = ResourceType.user;

  @IsString()
  readonly signature: string;

  @IsNumber()
  @IsOptional()
  readonly publicationSlug?: string;

  @IsNumber()
  @IsOptional()
  readonly baseID?: string;
}
