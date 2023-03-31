import { Request } from 'express';
import { Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { FileEntity } from '../../infra/db/entity/file-entity';
import { QueryBus } from '@nestjs/cqrs';
import { ExtractTokenQuery } from '../../../auth/application/query/extract-token.query';
import { VerifyTokenQuery } from '../../../auth/application/query/verify-token.query';
import { FindFileQuery } from '../../application/query/find-file.query';
import { ExistUserGroupQuery } from '../../../group/application/query/group-user-exist.query';
import { FileInfo } from '../../domain/file';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Injectable()
export class FileGuard implements CanActivate {
    constructor (
        private queryBus: QueryBus,
        private reflector: Reflector
    ) {  }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const handler = context.getHandler();
        const token = await this.queryBus.execute(new ExtractTokenQuery(request));

        if (token == null)
            return false;

        const tokenPayLoad = await this.queryBus.execute(new VerifyTokenQuery(token));

        if (tokenPayLoad == null)
            return false;
            
        return await this.validateRequest(handler, request, tokenPayLoad.userId);
    }

    private async validateRequest(handler: Function, request: any, authUserId: string): Promise<boolean> {
        const roles = this.reflector.get<string[]>('roles', handler);
        const fildId = request.params.fileId;

        let fileEntity: FileInfo | null = null;
        let userGroupPromises: Promise<any> | null = null;
        let adminGroupPromises: Promise<any> | null = null;
        let sharingGroups: string[] | null = request.body.sharingGroups ?? request.query.sharingGroups ?? null;
    
        if (fildId != undefined && typeof fildId == 'string')
        {
            fileEntity = await this.queryBus.execute(new FindFileQuery(fildId));
            sharingGroups = fileEntity.sharingGroups;
        }

        if (sharingGroups != null)
        {
            if(!sharingGroups.every((sharing_group) => typeof sharing_group == 'string'))
                return false;

            const findUserQuery = (groupId: string) => {
                const query = new ExistUserGroupQuery(groupId, authUserId, false, true, false);
                return this.queryBus.execute(query);
            }
            
            const findAdminQuery = (groupId: string) => {
                const query = new ExistUserGroupQuery(groupId, authUserId, true, false, false);
                return this.queryBus.execute(query);
            }
            
            userGroupPromises = Promise.all(sharingGroups.map(findUserQuery));
            adminGroupPromises = Promise.all(sharingGroups.map(findAdminQuery));
        }
    
        request.auth = {userId: authUserId, nUserId: authUserId};
        
        const results = await Promise.all(roles.map(async (value) => {
            if (value == 'uploader')
                return fileEntity != null && fileEntity.uploadUserId == authUserId;
            else if (value == 'groupUser')
                return userGroupPromises != null && (await userGroupPromises).every((value) => value);
            else if (value == 'groupAdmin')
                return adminGroupPromises != null && (await adminGroupPromises).every((value) => value);
            else if (value == 'userself')
                return authUserId != null;
            else
                return false;
        }));

        return results.some((value) => value);
  }
}
