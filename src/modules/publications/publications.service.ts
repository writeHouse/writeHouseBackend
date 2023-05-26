import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash';
import { Publication } from './publications.entity';
import { PublicationsRepository } from './publications.repository';
import { CreatePublicationDto } from './dto/create.publications.dto';

@Injectable()
export class PublicationsService {
  constructor(private publicationsRepository: PublicationsRepository) {}

  save(data: Partial<Publication>): Promise<Publication> {
    return this.publicationsRepository.save({
      ...data,
      createdAt: dayjs().format(),
      updatedAt: dayjs().format(),
    });
  }

  async fetchAllPublications({ limit = 30, page = 1 }: { limit: number; page: number }) {
    const take = limit;
    const skip = (page - 1) * take;

    const [publications, totalPublications] = await this.publicationsRepository.findAndCount({
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
        totalPages: Math.ceil(totalPublications / take),
        totalPublications,
      },
      publications,
    };
  }
}
