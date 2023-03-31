import { Body, Controller, Param, Post, Get, UseGuards, UseInterceptors, CACHE_MANAGER, Inject, Query, Put, Delete, CacheKey } from '@nestjs/common';
import { Auth } from '../../utils/deco/auth';
import { ParamAuth } from './deco/param-auth';
import { ParamBody } from './deco/param-body';
import { SearchGroupDto } from './dto/search-group';
import { SearchUserGroupDto } from './dto/search-user-group';
import { GroupGuard, Roles } from './guard/group-guard';
import { GroupExisted } from './pipe/group-existed.pipe';
import { UserInGroup } from './pipe/user-in-group';
import { UserInGroupAdmin } from './pipe/user-in-group-admin';
import { UserInGroupCandidates } from './pipe/user-in-group-cand';
import { HttpCacheInterceptor } from '../../utils/intercepter/cache-intercepter';
import { Cache } from 'cache-manager';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateGroupCommand } from '../application/command/group-create.command';
import { SearchUserGroupQuery } from '../application/query/group-user-search.query';
import { Group } from '../domain/group';
import { SearchGroupQuery } from '../application/query/group-search.query';
import { FindGroupQuery } from '../application/query/group-find.query';
import { UpdateGroupCommand } from '../application/command/group-update.command';
import { DeleteGroupCommand } from '../application/command/group-delete.command';
import { NonEmpty } from './pipe/non-empty';
import { CacheResetIntercepter } from '../../utils/intercepter/cache-reset-intercepter';

@UseGuards(GroupGuard)
@Controller('group')
export class GroupController {
    constructor(
        private commandBus: CommandBus,
        private queryBus: QueryBus,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    ) { }

    @UseInterceptors(CacheResetIntercepter)
    @CacheKey('GroupSearch')
    @Roles('userself')
    @Post('/create')
    async createGroup(
        @Auth('userId') userId: string,
        @Body('groupName', NonEmpty) groupName: string
    ): Promise<{[key: string]: string}> {
        const command = new CreateGroupCommand(userId, groupName);
        const groupId = await this.commandBus.execute(command);
        
        return {created: groupId};
    }

    @Roles('userself')
    @Get('/contain')
    async containGroup(
        @Auth('userId') userId: string,
        @Query() dto: SearchUserGroupDto
    ): Promise<{[key: string]: string}[]> {
        const { isAdmin, isCandidates, isUser, offset, limit } = dto;
        const query = new SearchUserGroupQuery(userId, isAdmin, isUser, isCandidates, offset, limit);
        const groups: Group[] = await this.queryBus.execute(query);
        
        return groups.map((group: Group) => {
            return {
                groupId: group.groupId,
                groupName: group.groupName
            };
        });
    }

    @UseInterceptors(HttpCacheInterceptor)
    @CacheKey('GroupSearch')
    @Roles('userself')
    @Get('/search')
    async searchGroup(
        @Query() dto: SearchGroupDto
    ): Promise<{[key: string]: string}[]> {
        const { groupName,offset, limit } = dto;
        const query = new SearchGroupQuery(groupName, offset, limit);
        const groups: Group[] = await this.queryBus.execute(query);
        return groups.map((group: Group) => {
            return {
                groupId: group.groupId,
                groupName: group.groupName
            };
        });
    }

    @Roles('groupAdmin')
    @Get('/:groupId')
    async findGroup(@Param('groupId', GroupExisted) groupId: string): Promise<{[name: string]: string | string[]}> {
        const query = new FindGroupQuery(groupId);
        const group: Group = await this.queryBus.execute(query);
    
        const payload : {[name: string]: string | string[]} = { 
            groupId: group.groupId,
            groupName: group.groupName,
            groupAdmins: group.groupAdmins,
            groupRequests: group.groupRequests,
            groupUsers: group.groupUsers
         };
        
        return payload;
    }

    @UseInterceptors(CacheResetIntercepter)
    @CacheKey('GroupSearch')
    @Roles('groupAdmin')
    @Put('/:groupId/update')
    async updateGroup(
        @Param('groupId', GroupExisted) groupId: string,
        @Body('groupName') groupName: string
    ): Promise<void> {
        const command = new UpdateGroupCommand(groupId, groupName, null, null, null, null);
        await this.commandBus.execute(command);
    }

    @UseInterceptors(CacheResetIntercepter)
    @CacheKey('GroupSearch')
    @Roles('groupAdmin')
    @Delete('/:groupId/delete')
    async deleteGroup(@Param('groupId', GroupExisted) groupId: string): Promise<void> {
        const command = new DeleteGroupCommand(groupId);
        await this.commandBus.execute(command);
    }

    @Roles('groupAdmin')
    @Post('/:groupId/addUser')
    async addUserToGroup(
        @Param('groupId', GroupExisted) groupId: string,
        @ParamBody(['groupId', 'nUserId'], UserInGroup) userId: string
    ): Promise<void> {
        const command = new UpdateGroupCommand(groupId, null, userId, null, true, null);
        await this.commandBus.execute(command);
    }

    @Roles('user', 'groupAdmin')
    @Delete('/:groupId/removeUser')
    async removeUserFromGroup(
        @Param('groupId', GroupExisted) groupId: string,
        @ParamBody(['groupId', 'userId'], UserInGroup) userId: string
    ): Promise<void> {
        const command = new UpdateGroupCommand(groupId, null, userId, null, false, null);
        await this.commandBus.execute(command);
    }

    @Roles('userself')
    @Post('/:groupId/addUserRequest')
    async addRequestToGroup(
        @Param('groupId', GroupExisted) groupId: string,
        @ParamAuth(['groupId', 'nUserId'], UserInGroupCandidates) userId: string
    ): Promise<void> {
        const command = new UpdateGroupCommand(groupId, null, userId, null, null, true);
        await this.commandBus.execute(command);   

    }

    @Roles('groupAdmin')
    @Post('/:groupId/approveUserRequest')
    async approveRequestInGroup(
        @Param('groupId', GroupExisted) groupId: string,
        @ParamBody(['groupId', 'userId'], UserInGroupCandidates) userId: string
    ): Promise<void> {
        const command = new UpdateGroupCommand(groupId, null, userId, null, true, false);
        await this.commandBus.execute(command);   
    }

    @Roles('user', 'groupAdmin')
    @Delete('/:groupId/removeUserRequest')
    async removeRequestInGroup(
        @Param('groupId', GroupExisted) groupId: string,
        @ParamBody(['groupId', 'userId'], UserInGroupCandidates) userId: string
    ): Promise<void> {
        const command = new UpdateGroupCommand(groupId, null, userId, null, null, false);
        await this.commandBus.execute(command);   
    }

    @Roles('groupAdmin')
    @Post('/:groupId/addAdmin')
    async addAdminToGroup(
        @Param('groupId', GroupExisted) groupId: string,
        @ParamBody(['groupId', 'nUserId'], UserInGroupAdmin) userId: string
    ): Promise<void> {
        const command = new UpdateGroupCommand(groupId, null, userId, true, null, null);
        await this.commandBus.execute(command);   
    }

    @Roles('groupAdmin')
    @Delete('/:groupId/removeAdmin')
    async removeAdminFromGroup(
        @Param('groupId', GroupExisted) groupId: string,
        @ParamBody(['groupId', 'userId'], UserInGroupAdmin) userId: string
    ): Promise<void> {
        const command = new UpdateGroupCommand(groupId, null, userId, false, null, null);
        await this.commandBus.execute(command);   
    }
}
