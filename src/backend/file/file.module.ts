import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateFileCommandHandler } from './application/command/create-file.handler';
import { DeleteFileCommandHandler } from './application/command/delete-file.handler';
import { UpdateFileCommandHandler } from './application/command/update-file.handler';
import { DownloadFileQueryHandler } from './application/query/download-file.handler';
import { FindFileQueryHandler } from './application/query/find-file.handler';
import { SearchFileQueryHandler } from './application/query/search-file.handler';
import { FileCreatedEventHandler } from './application/event/file-create.handler';
import { FileDeletedEventHandler } from './application/event/file-delete.handler';
import { FileUpdatedEventHandler } from './application/event/file-update.handler';
import { FileUserDeletedEventHandler } from './application/event/user-delete.handler';
import { FileGroupDeletedEventHandler } from './application/event/group-delete.handler';
import { FileFactory } from './domain/file.factory';
import { FileRepository } from './infra/db/repository/file.repository';
import { FileEntity, FileSchema } from './infra/db/entity/file-entity';
import { FileController } from './interface/file.controller';
import { FileGroupUpdatedEventHandler } from './application/event/group-update.handler';

const commandHandlers = [
  CreateFileCommandHandler,
  DeleteFileCommandHandler,
  UpdateFileCommandHandler
];

const queryHandlers = [
  DownloadFileQueryHandler,
  FindFileQueryHandler,
  SearchFileQueryHandler
];

const eventHandlers = [
  FileCreatedEventHandler,
  FileDeletedEventHandler,
  FileUpdatedEventHandler,
  FileUserDeletedEventHandler,
  FileGroupDeletedEventHandler,
  FileGroupUpdatedEventHandler
];

const factories = [
  FileFactory
];

const repositories = [
  { provide: 'FileRepository', useClass: FileRepository },
];

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([{ name: FileEntity.name, schema: FileSchema}]),
    AuthModule,
  ],
  controllers: [FileController],
  providers: [
    ...commandHandlers,
    ...queryHandlers,
    ...eventHandlers,
    ...factories,
    ...repositories,
  ],
})
export class FileModule { }