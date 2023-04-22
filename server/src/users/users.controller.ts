import { BaseController } from '../common/base.controller';
import { DITypes } from '../DITypes';
import { inject, injectable } from 'inversify';
import { ILoggerService } from '../logger/logger.service.interface';
import { IUsersController } from './interfaces/users.controller.interface';
import { NextFunction, Request, Response } from 'express';
import { IUsersService } from './interfaces/users.service.interface';
import { HttpError } from '../errors/http-error.class';

@injectable()
export class UsersController extends BaseController implements IUsersController {
	constructor(
		@inject(DITypes.LoggerService) private loggerService: ILoggerService,
		@inject(DITypes.UsersService) private usersService: IUsersService,
	) {
		super(loggerService);
		this.bindRoutes([
			{ method: 'post', path: '/register', func: this.register },
			{ method: 'post', path: '/login', func: this.login },
		]);
	}

	async register({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		const user = await this.usersService.createUser(body);
		if (user) {
			res.status(200).json({ ...user });
		} else {
			return next(new HttpError(422, 'This user already exists'));
		}
	}
	async login({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		// const user = await this.usersService.validateUser(body);
		// if (user) {
		// 	res.status(200).json({ ...user });
		// } else {
		// 	return next(new HttpError(422, 'Incorrect email or password'));
		// }
	}
}
