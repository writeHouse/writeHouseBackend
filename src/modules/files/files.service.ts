import { BadRequestException, Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { getUploadURL } from '../../config/aws-s3.service';
import { Web3Config } from '../../config/web3/config.web3.initializer';
import { validateWalletSignature } from '../../utils/validateWalletSignature';
import { UsersService } from '../users/users.service';
import { GetUploadSignedUrl } from './files.dto';
import { ResourceType } from '../../constants/shared';
import { PublicationsService } from '../publications/publications.service';
import { ArticlesService } from '../articles/articles.service';

@Injectable()
export class FilesService {
  constructor(
    private readonly userService: UsersService,
    private readonly articlesService: ArticlesService,
    private readonly publicationsService: PublicationsService,
  ) {}

  async getUploadSignedUrl(data: GetUploadSignedUrl) {
    const foundUser = await this.userService.findByAddress(data.walletAddress);

    if (!data.walletAddress || !foundUser) {
      throw new BadRequestException('Wallet address not found');
    }

    if (
      !(await validateWalletSignature({
        data,
        walletAddress: data.walletAddress,
        signature: data.signature,
      }))
    ) {
      throw new BadRequestException('Signature validation failed');
    }

    const { fileType, walletAddress, publicationSlug, resourceType, baseID } = data;

    const ext = fileType.split('/').pop();
    let fileName = `profile-images/${dayjs().format('YYYYMMDDHHMMSSS')}/${walletAddress.toLowerCase()}.${ext}`;

    if (resourceType === ResourceType.publication) {
      const publication = await this.publicationsService.findBySlug(publicationSlug);
      if (!publication) throw new BadRequestException('Publication not found');
      if (publication?.imageUrl) throw new BadRequestException('Publication image exist already');

      fileName = `publications-images/${dayjs().format('YYYYMMDDHHMMSSS')}/${publicationSlug}.${ext}`;
    }

    if (resourceType === ResourceType.article) {
      const articleFound = await this.articlesService.findByBaseId(baseID);
      if (!articleFound) throw new BadRequestException('Article not found');
      if (articleFound?.imageUrl) throw new BadRequestException('NFT image already exist');

      fileName = `articles-images/${dayjs().format('YYYYMMDDHHMMSSS')}/${baseID}.${ext}`;
    }

    const res = await getUploadURL({ fileName, fileType });

    return res;
  }
}
