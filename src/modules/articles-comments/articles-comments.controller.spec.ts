import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesCommentsController } from './articles-comments.controller';

describe('CommentsController', () => {
  let controller: ArticlesCommentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesCommentsController],
    }).compile();

    controller = module.get<ArticlesCommentsController>(ArticlesCommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
