import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ExtractRefreshTokenDecorator = createParamDecorator(
  (data, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    return req?.headers?.cookie?.split('refreshToken=')[1];
  },
);
