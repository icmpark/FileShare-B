import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";


export type GroupDocument = GroupEntity & Document;

@Schema()
export class GroupEntity {
    @Prop({type: String, index: true, unique: true})
    groupId: string;

    @Prop(String)
    groupName: string;

    @Prop({type: [String], index: true})
    groupAdmins: string[];

    @Prop({type: [String], index: true})
    groupUsers: string[];
    
    @Prop({type: [String], index: true})
    groupRequests: string[];
}

export const GroupSchema = SchemaFactory.createForClass(GroupEntity);