import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { FileDeletedEvent } from '../../domain/event/file-delete.event';
import { IFileRepository } from '../../domain/repository/ifile.repository';


@EventsHandler(FileDeletedEvent)
export class FileDeletedEventHandler implements IEventHandler<FileDeletedEvent> {
    constructor(
        @Inject('FileRepository') private fileRepository: IFileRepository,
    ) { }

    async handle(event: FileDeletedEvent) {
        switch (event.name) {
            case FileDeletedEvent.name: {
                const { fileIds } = event as FileDeletedEvent;
                await this.fileRepository.delete(fileIds);
                break;
            }
            default:
                break;
        }
    }
}