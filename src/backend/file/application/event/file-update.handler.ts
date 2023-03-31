import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { FileUpdatedEvent } from '../../domain/event/file-update.event';
import { IFileRepository } from '../../domain/repository/ifile.repository';


@EventsHandler(FileUpdatedEvent)
export class FileUpdatedEventHandler implements IEventHandler<FileUpdatedEvent> {
    constructor(
        @Inject('FileRepository') private fileRepository: IFileRepository,
    ) { }

    async handle(event: FileUpdatedEvent) {
        switch (event.name) {
            case FileUpdatedEvent.name: {
                const { 
                    fileId,
                    sharingGroups,
                    title,
                    description,
                    fileName,
                    filePath
                } = event as FileUpdatedEvent;
                await this.fileRepository.update(
                    fileId,
                    sharingGroups,
                    title,
                    description,
                    fileName,
                    filePath
                );
                break;
            }
            default:
                break;
        }
    }
}