export class Group {
    constructor(
        readonly groupId: string,
        readonly groupName: string,
        readonly groupAdmins: string[],
        readonly groupUsers: string[],
        readonly groupRequests: string[]
    ) { }
  }