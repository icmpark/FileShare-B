import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { GroupDeletedEvent } from 'src/backend/group/domain/event/group-delete.event';
import { FileInfo } from '../../domain/file';
import { FileFactory } from '../../domain/file.factory';
import { IFileRepository } from '../../domain/repository/ifile.repository';

@EventsHandler(GroupDeletedEvent)
export class FileGroupDeletedEventHandler implements IEventHandler<GroupDeletedEvent> {
    constructor(
        @Inject('FileRepository') private fileRepository: IFileRepository,
        private fileFactory: FileFactory
    ) { }

    async handle(event: GroupDeletedEvent) {
        switch (event.name) {
            case GroupDeletedEvent.name: {
                const { groupIds } = event as GroupDeletedEvent;
                if (groupIds.length == 0)
                    break;
                const files: FileInfo[] = await this.fileRepository.search(undefined, undefined, groupIds, 0, 0);
                if (files.length == 0)
                    break;
                this.fileFactory.delete(files.map((file: FileInfo) => file.fileId));
                break;
            }
            default:
                break;
        }
    }
}