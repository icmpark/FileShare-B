import { Injectable } from "@nestjs/common";
import { EventBus } from "@nestjs/cqrs";
import { FileCreatedEvent } from "./event/file-create.event";
import { FileUpdatedEvent } from "./event/file-update.event";
import { FileDeletedEvent } from "./event/file-delete.event";
import { FileInfo } from "./file";

@Injectable()
export class FileFactory {
    constructor (private eventBus: EventBus) {}

    create(
        fileId: string,
        uploadUserId: string,
        sharingGroups: string[],
        title: string,
        description: string,
        fileName: string,
        filePath: string
    ): FileInfo {

        const file = new FileInfo(
            fileId,
            uploadUserId,
            sharingGroups,
            title,
            description,
            fileName,
            filePath
        );
        
        this.eventBus.publish(new FileCreatedEvent(file));
        return file;
    }

    
    update(
        fileId: string,
        sharingGroups: string[],
        title: string,
        description: string,
        fileName: string,
        filePath: string
    ): void {
        this.eventBus.publish(new FileUpdatedEvent(
            fileId,
            sharingGroups,
            title,
            description,
            fileName,
            filePath
        ));
    }

    delete (fileIds: string[]): void {
        const event = new FileDeletedEvent(fileIds);
        this.eventBus.publish(event);
    }

    reconstitute(
        fileId: string,
        uploadUserId: string,
        sharingGroups: string[],
        title: string,
        description: string,
        fileName: string,
        filePath: string
    ): FileInfo {

        const file = new FileInfo(
            fileId,
            uploadUserId,
            sharingGroups,
            title,
            description,
            fileName,
            filePath
        );
        return file;
    }


}