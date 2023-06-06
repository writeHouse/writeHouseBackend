import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetUploadSignedUrl } from './files.dto';
import { FilesService } from './files.service';

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('/signed-url')
  async getUploadSignedUrl(@Body() data: GetUploadSignedUrl) {
    return await this.filesService.getUploadSignedUrl(data);
  }
}
