import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { FileCreatedEvent } from '../../domain/event/file-create.event';
import { IFileRepository } from '../../domain/repository/ifile.repository';


@EventsHandler(FileCreatedEvent)
export class FileCreatedEventHandler implements IEventHandler<FileCreatedEvent> {
    constructor(
        @Inject('FileRepository') private fileRepository: IFileRepository,
    ) { }

    async handle(event: FileCreatedEvent) {
        switch (event.name) {
            case FileCreatedEvent.name: {
                const { file } = event as FileCreatedEvent;
                await this.fileRepository.create(file);
                break;
            }
            default:
                break;
        }
    }
}