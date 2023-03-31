import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ParamAuth = createParamDecorator(
  (data: string[], ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const [groupId, userId] = data;
    return [request.params[groupId], request.auth[userId]];
  },
);