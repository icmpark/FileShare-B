import { Request } from 'express';
import { Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { QueryBus } from '@nestjs/cqrs';
import { ExtractTokenQuery } from 'src/backend/auth/application/query/extract-token.query';
import { VerifyTokenQuery } from 'src/backend/auth/application/query/verify-token.query';
import { ExistUserGroupQuery } from '../../application/query/group-user-exist.query';
import { TokenPayload } from 'src/backend/auth/domain/token-payload';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Injectable()
export class GroupGuard implements CanActivate {
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

        const tokenPayLoad: TokenPayload = await this.queryBus.execute(new VerifyTokenQuery(token));
    
        if (tokenPayLoad == null)
            return false;
            
        return await this.validateRequest(handler, request, tokenPayLoad.userId);
    }

    private async validateRequest(handler: Function, request: any, authUserId: string): Promise<boolean> {
        const roles = this.reflector.get<string[]>('roles', handler);
        const groupId = request.params.nGroupId ?? request.params.groupId;
        const userId = request.body.nUserId ?? request.body.userId;


        request.auth = {userId: authUserId, nUserId: authUserId};

        const results = await Promise.all(roles.map(async (value) => {
            if (value == 'user')
                return userId == authUserId;
            else if (value == 'groupAdmin')
                return await this.queryBus.execute(new ExistUserGroupQuery(groupId, authUserId, true, false, false));
            else if (value == 'userself')
                return authUserId != null;
            else
                return false;
        }));

        return results.some((value) => value);
  }
}
