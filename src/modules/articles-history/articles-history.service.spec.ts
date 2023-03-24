import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesHistoryService } from './articles-history.service';

describe('ArticlesHistoryService', () => {
  let service: ArticlesHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticlesHistoryService],
    }).compile();

    service = module.get<ArticlesHistoryService>(ArticlesHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
