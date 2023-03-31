import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ParamBody = createParamDecorator(
  (data: string[], ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const [groupId, userId] = data;
    return [request.params[groupId], request.body[userId]];
  },
);