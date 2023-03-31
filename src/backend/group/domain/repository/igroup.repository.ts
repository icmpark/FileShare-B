import { Group } from '../group';

export interface IGroupRepository {
    create: (group: Group) => Promise<void>;
    delete: (groupIds: string[]) => Promise<void>;
    update: (
        groupId: string,
        groupName: string,
        userId: string,
        addAdmin: boolean,
        addUser: boolean,
        addCandidates: boolean,
    ) => Promise<void>;
    deleteUser: (
        userId: string,
        isAdmin: boolean,
        isUser: boolean,
        isCandidates: boolean    
    ) => Promise<void>;
    search: (groupName: string, offset: number, limit: number) => Promise<Group[]>;
    searchUser: (
        userId: string,
        isAdmin: boolean,
        isUser: boolean,
        isCandidates: boolean,
        offset: number,
        limit: number    
    ) => Promise<Group[]>;
    existUser: (
        groupId: string,
        userId: string,
        isAdmin: boolean,
        isUser: boolean,
        isCandidates: boolean    
    ) => Promise<boolean>;
    findByGroupId: (groupId: string) => Promise<Group | null>;
    emptyAdmin:() => Promise<Group[]>;
}