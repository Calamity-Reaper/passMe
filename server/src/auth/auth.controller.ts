import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/http-error.class';
import { DITypes } from '../DITypes';
import { IAuthService } from './interfaces/auth.service.interface';
import { inject, injectable } from 'inversify';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { BaseController } from '../common/base.controller';
import { ILoggerService } from '../logger/logger.service.interface';
import { IAuthController } from './interfaces/auth.controller.interface';
import { AuthLoginDto } from './dto/auth-login.dto';
import { ValidateMiddleware } from '../common/middlewares/validate.middleware';

@injectable()
export class AuthController extends BaseController implements IAuthController {
	constructor(
		@inject(DITypes.AuthService) private authService: IAuthService,
		@inject(DITypes.LoggerService) private loggerService: ILoggerService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				method: 'post',
				path: '/register',
				func: this.registration,
				middlewares: [new ValidateMiddleware(AuthRegisterDto)],
			},
			{
				method: 'post',
				path: '/login',
				func: this.login,
				middlewares: [new ValidateMiddleware(AuthLoginDto)],
			},
			{ method: 'post', path: '/logout', func: this.logout },
			{ method: 'get', path: '/refresh', func: this.refresh },
		]);
	}
	async registration({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const data: AuthRegisterDto = { ...body };
			const userData = await this.authService.registerNewUser(data);
			res.cookie('refreshToken', userData.refresh, {
				maxAge: 6 * 60 * 60 * 1000,
				httpOnly: true,
			});
			res.status(200).json({ ...userData.user, accessToken: userData.access });
		} catch (e) {
			return next(e);
		}
	}
	async login({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const data: AuthLoginDto = { ...body };
			const userData = await this.authService.loginUser(data);
			res.cookie('refreshToken', userData.refresh, {
				maxAge: 6 * 60 * 60 * 1000,
				httpOnly: true,
			});
			res.status(200).json({ ...userData.user, accessToken: userData.access });
		} catch (e) {
			return next(e);
		}
	}

	async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { refreshToken } = req.cookies;
			await this.authService.logoutUser(refreshToken);
			res.clearCookie('refreshToken');
			res.status(200).json();
		} catch (e) {
			return next(e);
		}
	}

	async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { refreshToken } = req.cookies;
			const userData = await this.authService.refresh(refreshToken);
			res.cookie('refreshToken', userData.refresh, {
				maxAge: 6 * 60 * 60 * 1000,
				httpOnly: true,
			});
			res.status(200).json({ ...userData.user, accessToken: userData.access });
		} catch (e) {
			return next(e);
		}
	}
}
