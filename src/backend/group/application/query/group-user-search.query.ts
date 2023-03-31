import { IQuery } from '@nestjs/cqrs';

export class SearchUserGroupQuery implements IQuery {
  constructor(
    readonly userId: string,
    readonly isAdmin: boolean,
    readonly isUser: boolean,
    readonly isCandidates: boolean,
    readonly offset: number,
    readonly limit: number
  ) { }
}