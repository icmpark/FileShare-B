import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { CqrsModule } from '@nestjs/cqrs';
import { GroupUserDeletedEventHandler } from './application/event/user-delete.handler';
import { GroupController } from './interface/group.controller';
import { UserModule } from '../user/user.module';
import { CreateGroupCommandHandler } from './application/command/group-create.handler';
import { DeleteGroupCommandHandler } from './application/command/group-delete.handler';
import { UpdateGroupCommandHandler } from './application/command/group-update.handler';
import { DeleteGroupUserCommandHandler } from './application/command/group-user-delete.handler';
import { FindGroupQueryHandler } from './application/query/group-find.handler';
import { SearchUserGroupQueryHandler } from './application/query/group-user-search.handler';
import { SearchGroupQueryHandler } from './application/query/group-search.handler';
import { ExistUserGroupQueryHandler } from './application/query/group-user-exist.handler';
import { GroupCreatedEventHandler } from './application/event/group-create.handler';
import { GroupDeletedEventHandler } from './application/event/group-delete.handler';
import { GroupUpdatedEventHandler } from './application/event/group-update.handler';
import { GroupFactory } from './domain/group.factory';
import { GroupRepository } from './infra/db/repository/group.repository';
import { GroupEntity, GroupSchema } from './infra/db/entity/group-entity';

const commandHandlers = [
  CreateGroupCommandHandler,
  DeleteGroupCommandHandler,
  UpdateGroupCommandHandler,
  DeleteGroupUserCommandHandler
];

const queryHandlers = [
  FindGroupQueryHandler,
  SearchGroupQueryHandler,
  SearchUserGroupQueryHandler,
  ExistUserGroupQueryHandler
];

const eventHandlers = [
  GroupCreatedEventHandler,
  GroupDeletedEventHandler,
  GroupUpdatedEventHandler,
  GroupUserDeletedEventHandler
];

const factories = [
  GroupFactory
];

const repositories = [
  { provide: 'GroupRepository', useClass: GroupRepository },
];

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([{ name: GroupEntity.name, schema: GroupSchema}]),
    AuthModule,
    UserModule
  ],
  controllers: [GroupController],
  providers: [
    ...commandHandlers,
    ...queryHandlers,
    ...eventHandlers,
    ...factories,
    ...repositories,
  ],
  exports: [
    ...commandHandlers,
    ...queryHandlers,
  ]
})
export class GroupModule { }