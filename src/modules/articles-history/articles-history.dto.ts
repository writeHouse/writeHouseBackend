import { IsNumber, IsString, IsOptional, IsEnum } from 'class-validator';
import { SupportedChain } from '../../constants/shared';

export type ArticleEventType = 'SALE' | 'MINT' | 'PRICE_UPDATE' | 'TRANSFER';

export class SaveArticleHistoryDto {
  @IsNumber()
  actorId: number;

  @IsString()
  actorAddress: string;

  @IsNumber()
  receiverId: number;

  @IsString()
  receiverAddress: string;

  @IsString()
  type: ArticleEventType;

  @IsNumber()
  nftTokenId: number;

  @IsString()
  transactionHash: string;

  @IsNumber()
  currentPrice: number;

  @IsNumber()
  newPrice: number;

  @IsString()
  payload: string;

  @IsOptional()
  @IsEnum(SupportedChain)
  chain?: SupportedChain = SupportedChain.BINANCE;

  @IsString()
  createdAt: Date | string;

  @IsString()
  updatedAt: Date | string;
}
