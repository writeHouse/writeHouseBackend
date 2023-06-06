import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesCommentsService } from './articles-comments.service';

describe('CommentsService', () => {
  let service: ArticlesCommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticlesCommentsService],
    }).compile();

    service = module.get<ArticlesCommentsService>(ArticlesCommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
