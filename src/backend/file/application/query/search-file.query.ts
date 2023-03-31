import { IQuery } from '@nestjs/cqrs';

export class SearchFileQuery implements IQuery {
  constructor(
    readonly title: string,
    readonly sharingGroups: string[],
    readonly offset: number,
    readonly limit: number
  ) { }
}