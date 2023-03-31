import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateFileCommand } from './update-file.command';
import { FileFactory } from '../../domain/file.factory';
import { IFileRepository } from '../../domain/repository/ifile.repository';
import { v4 as uuid } from 'uuid'

@Injectable()
@CommandHandler(UpdateFileCommand)
export class UpdateFileCommandHandler implements ICommandHandler<UpdateFileCommand> {
    constructor(
        private fileFactory: FileFactory,
        @Inject('FileRepository') private fileRepository: IFileRepository
    ) { }

    async execute(command: UpdateFileCommand): Promise<void> {
        const { files, fileId, title, description, sharingGroups } = command;

        let [filePath, fileName] = [undefined, undefined];

        if (files.length != 0)
            [filePath, fileName] = await this.fileRepository.save(fileId, title, files);

        this.fileFactory.update(fileId, sharingGroups, title, description, fileName, filePath);
    }
}