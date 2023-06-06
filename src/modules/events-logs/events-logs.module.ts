import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Web3Config } from '../../config/web3/config.web3.initializer';
import { ArticleRepository } from '../articles/articles.repository';
import { PublicationsRepository } from '../publications/publications.repository';
import { EventLogRepository } from './events-logs.repository';
import { EventLogService } from './events-logs.service';

@Module({
  imports: [TypeOrmModule.forFeature([EventLogRepository, ArticleRepository, PublicationsRepository])],
  providers: [EventLogService, Web3Config],
})
export class EventsLogModule {}
