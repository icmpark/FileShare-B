import { IQuery } from '@nestjs/cqrs';
import { ObjectId } from 'mongoose';

export class SearchGroupQuery implements IQuery {
  constructor(
    readonly groupName: string,
    readonly offset: number,
    readonly limit: number
  ) { }
}