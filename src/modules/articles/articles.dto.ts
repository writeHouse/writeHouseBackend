import { IsBoolean, IsNumber, IsString, IsOptional, IsArray, ValidateNested, IsEnum, MinLength } from 'class-validator';
import { SupportedChain } from '../../constants/shared';

export class CreateArticleDto {
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  categories: string[];

  @IsString()
  baseID: string;

  @IsNumber()
  @IsOptional()
  publicationId: number;

  @IsString()
  title: string;

  @IsString()
  @MinLength(100)
  description: string;

  @IsString()
  @IsOptional()
  walletAddress: string;

  @IsNumber()
  price: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  @IsString()
  @IsOptional()
  @IsEnum(SupportedChain)
  chain?: SupportedChain = SupportedChain.BINANCE;

  @IsString()
  @IsOptional()
  country?: string;
}

export class UpdateArticleTokenDto {
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  @IsString()
  baseID: string;

  @IsString()
  tokenID: string;

  @IsString()
  transactionHash: string;

  @IsOptional()
  @IsEnum(SupportedChain)
  chain?: SupportedChain = SupportedChain.BINANCE;
}

export class UpdateNftListingStatusDto {
  @IsBoolean()
  setIsListed: boolean;

  @IsString()
  ownerAddress: string;

  @IsString()
  listingUpdateTxHash: string;

  @IsOptional()
  @IsEnum(SupportedChain)
  chain?: SupportedChain = SupportedChain.BINANCE;
}

export class UpdateNftPriceDto {
  @IsNumber()
  newPrice: number;

  @IsString()
  priceUpdateTxHash: string;

  @IsOptional()
  @IsEnum(SupportedChain)
  chain?: SupportedChain = SupportedChain.BINANCE;
}
