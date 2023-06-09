import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Patch, Post, Put, Query, Req } from '@nestjs/common';
import { SaleType } from '../articles-history/articles-history.entity';
import { ArticlesHistoryService } from '../articles-history/articles-history.service';
import { UsersService } from '../users/users.service';
import { CreateArticleDto, UpdateArticleTokenDto, UpdateNftListingStatusDto } from './articles.dto';
import { ArticlesService } from './articles.service';

@Controller('articles')
export class ArticlesController {
  constructor(
    private readonly articlesService: ArticlesService,
    private readonly userService: UsersService,
    private readonly articlesHistoryService: ArticlesHistoryService,
  ) {}

  @Get('/')
  async fetchAllArticles(@Query() { limit = 30, page = 1 }: { limit: number; page: number }) {
    return await this.articlesService.fetchArticlesPerPage({ limit, page });
  }

  @Post('/')
  async createArticle(@Body() articleData: CreateArticleDto, @Req() req) {
    const { polyglot } = req;

    const country = req.headers['cf-ipcountry'];

    const articleAuthor = await this.userService.findByAddress(articleData.walletAddress);

    if (!articleAuthor || articleAuthor.notAllowedToPost) {
      throw new BadRequestException(polyglot.t('User not allowed to post'));
    }
    const article = await this.articlesService.save({ ...articleData, country });

    return {
      message: polyglot.t('article created successfully with id: %{id}', {
        id: articleData.baseID,
      }),
      article,
    };
  }

  @Put('/update-token')
  async updateArticleToken(@Body() data: UpdateArticleTokenDto, @Req() req) {
    const { polyglot } = req;
    const article = await this.articlesService.findByBaseId(data.baseID);

    if (!article) {
      throw new NotFoundException(polyglot.t('Article not found'));
    }

    const foundHistory = await this.articlesHistoryService.findByTransactionHash(data.transactionHash);

    if (foundHistory || article?.transactionHash) {
      throw new BadRequestException(polyglot.t('Article already exists'));
    }

    const validatedMint = await this.articlesService.validateMintTransaction(article);

    if (!validatedMint) {
      throw new BadRequestException('FAILED_VALIDATING_MINT: Mint request could not be validated');
    }

    await Promise.all([
      await this.articlesService.updateArticle(article.id, {
        baseID: data.baseID,
        transactionHash: data.transactionHash,
        tokenID: data.tokenID,
        imageUrl: data?.imageUrl || article.imageUrl || null,
        thumbnailUrl: data?.thumbnailUrl || article.thumbnailUrl || null,
        listedOnChain: true,
      }),
      await this.userService.increment({ id: article.authorId, column: 'createdCount' }),
    ]);

    await this.articlesHistoryService.save({
      type: SaleType.MINT,
      articleId: article?.id,
      tokenId: data?.tokenID,
      actorId: article?.authorId || article?.ownerId || null,
      actorAddress: article.authorAddress || null,
      transactionHash: data?.transactionHash,
      currentPrice: article?.price || null,
      chain: data?.chain,
    });

    return {
      message: polyglot.t('Article token ID updated successfully'),
      article: { article, ...data },
    };
  }

  @Put('/:baseID/listed')
  async ArticleListingStatus(
    @Param('baseID') baseID: string,
    @Body() data : UpdateNftListingStatusDto,
    @Req() req
    ){

      const { polyglot } = req;

      const article = await this.articlesService.findByBaseId(baseID)

      if(!article){
        return new NotFoundException(polyglot.t('Article not found'))
      }

      const isValidTrasanction = this.articlesService.validateListingStatus(data, article)

      if(!isValidTrasanction){
        throw new BadRequestException(polyglot.t('Invalid listing status transaction'))
      }

      await this.articlesService.updateArticle(article.id, {
        listed: data.setIsListed,
        listedOnChain: true,
      })

      return 'Article listing status updated successfully';



  }

}
