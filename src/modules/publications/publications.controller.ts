import { Body, Controller, Get, NotFoundException, Post, Query, Req } from '@nestjs/common';
import { slugGenerator } from 'src/utils/slug.generator';
import { PublicationsService } from './publications.service';
import { CreatePublicationDto } from './dto/create.publications.dto';
import { UsersService } from '../users/users.service';

@Controller('publications')
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService, private readonly usersService: UsersService) {}

  @Get('/')
  async fetchAllPublications(@Query() { limit = 30, page = 1 }: { limit: number; page: number }) {
    return await this.publicationsService.fetchAllPublications({ limit, page });
  }

  @Post('/')
  async createPublications(@Body() publicationData: CreatePublicationDto, @Req() req) {
    const { polyglot } = req;

    const { title } = publicationData;

    const currentUser = await this.usersService.findByAddress(publicationData.creatorAddress);

    if (!currentUser) {
      throw new NotFoundException('User not found');
    }

    const slug = slugGenerator(title);

    const publication = await this.publicationsService.save({
      title,
      slug,
      description: title,
      creatorId: currentUser.id,
      creatorAddress: currentUser.walletAddress,
      title_search: `${title} ${currentUser.walletAddress}`.toLowerCase(),
      description_search: `${title} ${currentUser.walletAddress}`.toLowerCase(),
    });

    return {
      message: polyglot.t('publication created successfully'),
      publication,
    };
  }
}
