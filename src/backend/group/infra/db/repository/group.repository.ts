import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt'
import authConfig from '../../../../config/authConfig';
import { ConfigType } from '@nestjs/config';
import { Group } from '../../../domain/group';
import { GroupDocument, GroupEntity } from '../entity/group-entity';
import { IGroupRepository } from '../../../domain/repository/igroup.repository';
import { GroupFactory } from '../../../domain/group.factory';
import { regexEscape } from '../../../../utils/func/regex-escape';


@Injectable()
export class GroupRepository implements IGroupRepository {
    constructor(
        @InjectModel(GroupEntity.name) private groupModel: Model<GroupDocument>,
        @Inject(authConfig.KEY) private config: ConfigType<typeof authConfig>,
        private groupFactory: GroupFactory
    ) { }

    
    async create(group: Group): Promise<void> {
        const groupDto = {
            groupId: group.groupId,
            groupName: group.groupName,
            groupAdmins: group.groupAdmins,
            groupUsers: group.groupUsers,
            groupRequests: group.groupRequests
        };
        const createdGroup: GroupDocument = new this.groupModel(groupDto);
        createdGroup.save();
    }

    async delete(groupIds: string[]): Promise<void> {
        await this.groupModel.deleteMany({groupId: { $in: groupIds }});
    }
    
    async update(
        groupId: string,
        groupName: string,
        userId: string,
        addAdmin: boolean,
        addUser: boolean,
        addCandidates: boolean,
    ): Promise<void> {
        let query = {}

        if (groupName != null)
            query['$set'] = {groupName: groupName};
        
        if (userId != null)
        {
            if(addAdmin == true  || addUser == true || addCandidates == true)
                query['$push'] = {}

            if(addAdmin == false  || addUser == false || addCandidates == false)
                query['$pull'] = {}

            if(addAdmin != null)
            {
                if(addAdmin)
                    query['$push']['groupAdmins'] = userId;
                else
                    query['$pull']['groupAdmins'] = userId;
            }

            if(addUser != null)
            {
                if(addUser)
                    query['$push']['groupUsers'] = userId;
                else
                    query['$pull']['groupUsers'] = userId;
            }

            if(addCandidates != null)
            {
                if(addCandidates)
                    query['$push']['groupRequests'] = userId;
                else
                    query['$pull']['groupRequests'] = userId;
            }
        }

        await this.groupModel.updateOne({groupId: groupId}, query);
    }
    
    async deleteUser(
        userId: string,
        isAdmin: boolean,
        isUser: boolean,
        isCandidates: boolean    
    ): Promise<void> {
        let findQuery = [];
        let deleteQuery = {};
        
        if (isAdmin)
        {
            findQuery.push({ groupAdmins: {$in: [userId]}});
            deleteQuery['groupAdmins'] = userId;
        }

        if (isUser)
        {
            findQuery.push({ groupUsers: {$in: [userId]}});
            deleteQuery['groupUsers'] = userId;
        }

        if (isCandidates)
        {
            findQuery.push({ groupRequests: {$in: [userId]}});
            deleteQuery['groupRequests'] = userId;
        }
            
        const searchQuery = { $or: findQuery };
        const query = { $pull: deleteQuery };

        await this.groupModel.updateMany(searchQuery, query);
    }
    async search(groupName :string, offset:number, limit:number): Promise<Group[]> {
        const query: {[name: string]: any} = {groupName:{ $regex: regexEscape(groupName)}};
        
        const result = await this.groupModel
                                .find(query)
                                .sort({name: 1})
                                .skip(offset)
                                .limit(limit);

        return result.map((group: GroupDocument): Group => {
            return this.groupFactory.reconstitute(
                group.groupId,
                group.groupName,
                group.groupAdmins,
                group.groupUsers,
                group.groupRequests
            );
        });
    }
    async searchUser(
        userId: string,
        isAdmin: boolean,
        isUser: boolean,
        isCandidates: boolean,
        offset: number,
        limit: number    
    ): Promise<Group[]> {
        const query: {[name: string]: any} = {userId: userId};

        if (isAdmin)
            query.groupAdmins = { $in : [userId]};

        if (isCandidates)
            query.groupRequests = { $in : [userId]};
            
        if (isUser)
            query.groupUsers = { $in : [userId]};
        
        const result = await this.groupModel
                                .find(query)
                                .sort({_id: 1})
                                .skip(offset)
                                .limit(limit);

        return result.map((group: GroupDocument): Group => {
            return this.groupFactory.reconstitute(
                group.groupId,
                group.groupName,
                group.groupAdmins,
                group.groupUsers,
                group.groupRequests
            );
        });
    };

    async existUser(
        groupId: string,
        userId: string,
        isAdmin: boolean,
        isUser: boolean,
        isCandidates: boolean    
    ): Promise<boolean> {

        let query: {[key: string]: any } = { groupId: groupId };

        if (isAdmin)
            query.groupAdmins = { $in: [userId] };
        if (isUser)
            query.groupUsers = { $in: [userId] };
        if (isCandidates)
            query.groupRequests = { $in: [userId] };

        const numGroups: number = await this.groupModel.countDocuments(query);
        
        return 0 < numGroups;
    };


    async findByGroupId(groupId: string): Promise<Group | null> {
        const groupDocument = await this.groupModel.findOne({groupId: groupId});
        
        if (groupDocument == null)
            return null;

        return this.groupFactory.reconstitute(
            groupDocument.groupId,
            groupDocument.groupName,
            groupDocument.groupAdmins,
            groupDocument.groupUsers,
            groupDocument.groupRequests
        );
    }
    async emptyAdmin(): Promise<Group[]> {
        const groups = await this.groupModel.find({ $expr: { $eq: [{$size: '$groupAdmins'}, 0]}});
        
        return groups.map((group: GroupDocument): Group => {
            return this.groupFactory.reconstitute(
                group.groupId,
                group.groupName,
                group.groupAdmins,
                group.groupUsers,
                group.groupRequests
            );
        });
    }

}