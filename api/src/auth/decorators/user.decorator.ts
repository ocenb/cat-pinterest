import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Payload } from '../models/payload.model';

export const UserData = createParamDecorator(
	(data: keyof Payload, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest();
		const user = request.user;

		return data ? user[data] : user;
	}
);
