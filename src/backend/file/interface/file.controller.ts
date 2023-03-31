import {  Controller, Param, Post, Get, UseGuards, UseInterceptors, Bind, UploadedFiles, Response, StreamableFile, BadRequestException, CACHE_MANAGER, Inject, CacheKey, Put, Delete } from '@nestjs/common';
import { Auth } from '../../utils/deco/auth';
import { CreateFileDto } from './dto/create-file.dto'
import { fileMulConfig } from '../../config/fileConfig';
import { FilesInterceptor } from '@nestjs/platform-express';
import { SearchFileDto } from './dto/search-file.dto';
import { FileGuard, Roles } from './guard/file-guard';
import { FileExisted } from './pipe/file-existed';
import { BodyAuth } from './deco/body-auth';
import { UserGroup } from './pipe/user-group';
import { UpdateFileDto } from './dto/update-file.dto';
import { SUserGroup } from './pipe/update-pipe';
import { HttpCacheInterceptor } from '../../utils/intercepter/cache-intercepter';
import { Cache } from 'cache-manager';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateFileCommand } from '../application/command/create-file.command';
import { FileInfo } from '../domain/file';
import { SearchFileQuery } from '../application/query/search-file.query';
import { UpdateFileCommand } from '../application/command/update-file.command';
import { DeleteFileCommand } from '../application/command/delete-file.command';
import { DownloadFileQuery } from '../application/query/download-file.query';
import { CacheResetIntercepter } from '../../utils/intercepter/cache-reset-intercepter';
import { QueryAuth } from './deco/query-auth';

@UseGuards(FileGuard)
@Controller('file')
export class FileController {
    constructor(
        private commandBus: CommandBus,
        private queryBus: QueryBus,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    ) { }

    @UseInterceptors(CacheResetIntercepter)
    @CacheKey('FileSearch')
    @Roles('userself')
    @Post('/create')
    @UseInterceptors(FilesInterceptor('files', null, fileMulConfig))
    @Bind(UploadedFiles())  
    async createFile(
        files: File[],
        @Auth('userId') userId: string,
        @BodyAuth('userId', UserGroup) dto: CreateFileDto
    ): Promise<{[key: string]: string}> {
        if(files.length == 0)
            throw new BadRequestException({"message": "No files!"});
        const { title, description, sharingGroups } = dto;
        const command = new CreateFileCommand(files, userId, title, description, sharingGroups);
        const fileId = await this.commandBus.execute(command);
        return {created: fileId};
    }

    @UseInterceptors(HttpCacheInterceptor)
    @CacheKey('FileSearch')
    @Roles('groupUser')
    @Get('/search')
    async searchFile(
        @QueryAuth('userId', UserGroup) dto: SearchFileDto
    ): Promise<{[key: string]: string}[]> {
        const {title, sharingGroups, offset, limit} = dto;
        const fileInfos: FileInfo[] = await this.queryBus.execute(new SearchFileQuery(
            title,
            sharingGroups,
            offset,
            limit
        ));

        return fileInfos.map((fileInfo: FileInfo): {[key: string]: string} => {
            return {
                fileId: fileInfo.fileId,
                title: fileInfo.title,
                description: fileInfo.description
            };
        });
    }

    @UseInterceptors(CacheResetIntercepter)
    @CacheKey('FileSearch')
    @Roles('uploader', 'groupAdmin')
    @UseInterceptors(FilesInterceptor('files', null, fileMulConfig))
    @Bind(UploadedFiles())  
    @Put('/:fileId/update')
    async updateFile(
        files: File[],
        @Param('fileId', FileExisted) fileId: string,
        @BodyAuth('userId', SUserGroup) dto: UpdateFileDto
    ): Promise<void> {
        const {title, description, sharingGroups} = dto
        const command = new UpdateFileCommand(fileId, files, title, description, sharingGroups);
        await this.commandBus.execute(command);
    }

    @UseInterceptors(CacheResetIntercepter)
    @CacheKey('FileSearch')
    @Roles('uploader', 'groupAdmin')
    @Delete('/:fileId/delete')
    async deleteFile(
        @Param('fileId', FileExisted) fileId: string
    ): Promise<void> {
        this.commandBus.execute(new DeleteFileCommand(fileId));
    }

    @Roles('groupUser')
    @Get('/:fileId/download')
    async getFile(
        @Response({ passthrough: true }) res, 
        @Param('fileId', FileExisted) fileId: string
    ): Promise<StreamableFile> {
        const [file, fileName] = await this.queryBus.execute(new DownloadFileQuery(fileId));
        res.set({
            // 'Content-Type': 'application/json',
            'Content-Disposition': "attachment; filename*= UTF-8''" + fileName + "; filename=\"" + fileName + "\""
        });
        return file
    }
}
