import { IQuery } from '@nestjs/cqrs';

export class ExistUserGroupQuery implements IQuery {
  constructor(
    readonly groupId: string,
    readonly userId: string,
    readonly isAdmin: boolean,
    readonly isUser: boolean,
    readonly isCandidates: boolean
  ) { }
}