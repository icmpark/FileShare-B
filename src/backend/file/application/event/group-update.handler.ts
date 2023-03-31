import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { GroupUpdatedEvent } from '../../../group/domain/event/group-update.event';
import { FileInfo } from '../../domain/file';
import { FileFactory } from '../../domain/file.factory';
import { IFileRepository } from '../../domain/repository/ifile.repository';

@EventsHandler(GroupUpdatedEvent)
export class FileGroupUpdatedEventHandler implements IEventHandler<GroupUpdatedEvent> {
    constructor(
        @Inject('FileRepository') private fileRepository: IFileRepository,
        private fileFactory: FileFactory
    ) { }

    async handle(event: GroupUpdatedEvent) {
        switch (event.name) {
            case GroupUpdatedEvent.name: {
                const { groupId, userId, addUser } = event as GroupUpdatedEvent;

                if (addUser != false)
                    break;

                const files: FileInfo[] = await this.fileRepository.search(undefined, userId, [groupId], 0, 0);
                
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