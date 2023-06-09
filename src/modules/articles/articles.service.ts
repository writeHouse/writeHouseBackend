import { Injectable } from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import dayjs from 'dayjs';
import { logger } from '../../utils/logger';
import { LogType, Web3Helper, Web3Service } from '../../utils/web3Helper';
import { UsersRepository } from '../users/users.repository';
import { CreateArticleDto, UpdateNftListingStatusDto } from './articles.dto';
import { Article } from './articles.entity';
import { ArticleRepository } from './articles.repository';
import { Web3Config } from '../../config/web3/config.web3.initializer';
import { EventLogRepository } from '../events-logs/events-logs.repository';

@Injectable()
export class ArticlesService {
  constructor(
    public articleRepository: ArticleRepository,
    public readonly userRepository: UsersRepository,
    public readonly eventLogRepository: EventLogRepository,
    public readonly web3Config: Web3Config,
  ) {}

  async fetchArticlesPerPage({ limit = 30, page = 1 }: { limit: number; page: number }) {
    const take = limit;
    const skip = (page - 1) * take;

    const [articles, totalArticles] = await this.articleRepository.findAndCount({
      order: {
        id: 'DESC',
      },
      take,
      skip,
    });

    return {
      meta: {
        limit,
        currentPage: page,
        totalPages: Math.ceil(totalArticles / take),
        totalArticles,
      },
      articles,
    };
  }

  async checkReplayAttack(transactionHash: string): Promise<boolean> {
    const eventFound = await this.eventLogRepository.findOne({
      where: { transactionHash: transactionHash.toLowerCase() },
    });

    if (eventFound) {
      logger.warn('REPLAY_ATTACK_PROTECTION', {
        transactionHash,
      });
      return false;
    }

    return true;
  }

  async validateMintTransaction(trxData: Partial<Article>): Promise<boolean> {
    logger.info('VALIDATING_MINT_TX', trxData);
    try {
      const { transactionHash, chain, ownerAddress, price, tokenID, id, authorId } = trxData;
      const { web3, marketContractAddress } = this.web3Config.getWeb3Params(chain);
      const web3Service = new Web3Service(web3);

      await this.checkReplayAttack(transactionHash);

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

      const mintDecodedLog = web3Service.decodeLog(transactionReceipt.logs[1], LogType.MINTED);

      if (mintDecodedLog.tokenID !== tokenID) {
        logger.warn('VALIDATING_MINT_TX_FAILED - TokenID mismatch different from on-chain tokenID', {
          onChainTokenID: mintDecodedLog.tokenID,
          nftIDUpdateTokenID: tokenID,
        });
        return false;
      }

      const nftPrice = web3.utils.toWei(price.toString(), 'ether');
      if (nftPrice !== mintDecodedLog.price) {
        logger.warn('VALIDATING_MINT_TX_FAILED - Price mismatch different from on-chain price', {
          onChainTokenPrice: mintDecodedLog.price,
          currentTokenPrice: nftPrice,
        });
        return false;
      }

      if (mintDecodedLog.minterAddress.toLowerCase() !== ownerAddress.toLowerCase()) {
        logger.warn('VALIDATING_MINT_TX_FAILED - Minter or owner address mismatch different from on-chain address', {
          onChainTokenOwner: mintDecodedLog.minterAddress,
          currentOwnerAddress: ownerAddress,
        });
        return false;
      }

      await this.eventLogRepository.save({
        data: JSON.stringify(mintDecodedLog),
        type: 'Minted',
        transactionHash: transactionHash.toLowerCase(),
        triggerAddress: transactionReceipt.from,
        userId: authorId || null,
        articleId: id || null,
      });

      return true;
    } catch (error) {
      logger.error('VALIDATE_MINT_TRANSACTION_ERR error', { trxData, error });
      return false;
    }
  }

  async validateListingStatus(data: UpdateNftListingStatusDto, article: Partial<Article>): Promise<boolean> {
    logger.info('VALIDATING_LISTING_STATUS_TX', article);
    try {
      const { setIsListed, listingUpdateTxHash } = data;
      const { chain, tokenID, id, authorId } = article;
      const { web3, marketContractAddress } = this.web3Config.getWeb3Params(chain);
      const web3Service = new Web3Service(web3);

      await this.checkReplayAttack(listingUpdateTxHash);

      const transactionReceipt = await web3.eth.getTransactionReceipt(listingUpdateTxHash.toLowerCase());

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

      const listingStatusDecodedLog = web3Service.decodeLog(transactionReceipt.logs[1], LogType.LISTING_UPDATED);

      if (listingStatusDecodedLog.tokenID !== tokenID) {
        logger.warn('VALIDATING_LISTING_STATUS_TX_FAILED - TokenID mismatch different from on-chain tokenID', {
          onChainTokenID: listingStatusDecodedLog.tokenID,
          nftIDUpdateTokenID: tokenID,
        });
        return false;
      }

      const onChainListStatus = Boolean(listingStatusDecodedLog.isListed);
      if (onChainListStatus !== setIsListed) {
        logger.warn('Listing status mismatch different from on-chain status', {
          onChainListStatus,
          nftListingUpdateStatus: setIsListed,
        });
        return false;
      }

      await this.eventLogRepository.save({
        data: JSON.stringify(listingStatusDecodedLog),
        type: 'Minted',
        transactionHash: listingUpdateTxHash.toLowerCase(),
        triggerAddress: transactionReceipt.from,
        userId: authorId || null,
        articleId: id || null,
      });

      return true;
    } catch (error) {
      logger.error('VALIDATE_LISTING_STATUS_TRANSACTION_ERR error', { article, error });
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
    // @ts-ignore
    return this.articleRepository.update(id, {
      ...data,
      status: 'published',
    });
  }
}
