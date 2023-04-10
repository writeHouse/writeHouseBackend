import { Injectable } from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import dayjs from 'dayjs';
import { logger } from '../../utils/logger';

import { Web3Helper } from '../../utils/web3Helper';
import { UsersRepository } from '../users/users.repository';
import { CreateArticleDto } from './articles.dto';
import { Article } from './articles.entity';
import { ArticleRepository } from './articles.repository';
import { Web3Config } from '../../config/web3/config.web3.initializer';

@Injectable()
export class ArticlesService {
  constructor(
    public articleRepository: ArticleRepository,
    public readonly userRepository: UsersRepository,
    public readonly web3Config: Web3Config,
  ) {}

  async validateMintTransaction(trxData: Partial<Article>): Promise<boolean> {
    logger.info('VALIDATING_MINT_TX', trxData);
    try {
      const { transactionHash, chain, ownerAddress } = trxData;
      const { web3, marketContractAddress } = this.web3Config.getWeb3Params(chain);

      const transactionReceipt = await web3.eth.getTransactionReceipt(transactionHash.toLowerCase());

      if (!transactionReceipt?.blockHash || !transactionReceipt?.blockNumber || !transactionReceipt?.status) {
        logger.warn('Transaction failed or might still be pending', {
          blockHash: transactionReceipt?.blockHash,
          blockNumber: transactionReceipt?.blockNumber,
          status: transactionReceipt?.status,
        });
        return false;
      }

      if (marketContractAddress.toLowerCase() !== transactionReceipt?.to.toLowerCase()) {
        logger.warn('Sent to the wrong contract address', {
          to: transactionReceipt?.to,
          from: transactionReceipt?.from,
        });
        return false;
      }

      if (transactionReceipt?.from.toLowerCase() !== ownerAddress.toLowerCase()) {
        logger.warn('Owner address mismatch different from on-chain address', {
          onChainProposer: transactionReceipt.from,
          currentProposer: ownerAddress,
        });
        return false;
      }

      return true;
    } catch (error) {
      logger.error('VALIDATE_TRANSACTION_ERR error', { trxData, error });
      return false;
    }
  }

  async save(data: CreateArticleDto): Promise<Article> {
    const walletAddress = Web3Helper.getAddressChecksum(data?.walletAddress);
    let user = await this.userRepository.findOne({
      where: {
        walletAddress,
      },
    });    

    if (!user) {
      user = await this.userRepository.save({
        walletAddress: data?.walletAddress,
      });
    }

    const article = new Article();
    article.authorId = user?.id;
    article.ownerId = user?.id;
    article.categories = data.categories;
    article.ownerAddress = user?.walletAddress || data.walletAddress;
    article.authorAddress = user?.walletAddress || data.walletAddress;
    article.baseID = data.baseID;
    article.price = data.price;
    article.title = data.title || '';
    article.title_search = article.title.toLowerCase();
    article.description = data.description || '';
    article.description_search = article.description.toLowerCase();
    article.imageUrl = data.imageUrl;
    article.thumbnailUrl = data.imageUrl;
    article.publicationId = data.publicationId || null;
    article.listed = true;
    article.priority = 0;
    article.createdAt = dayjs().format();
    article.updatedAt = dayjs().format();
    article.status = 'published';
    article.chain = data?.chain;
    article.country = data?.country;

    return this.articleRepository.save(article);
  }

  findByBaseId(baseID: string): Promise<Article> {
    return this.articleRepository.findOne({
      relations: ['owner', 'author'],
      where: {
        baseID,
      },
    });
  }

  updateArticle(id: number, data: Partial<Article>): Promise<UpdateResult> {
    return this.articleRepository.update(id, {
      ...data,
      status: 'published',
    });
  }
}
