import { inject, injectable } from 'inversify';
import { Server } from 'http';
import express, { Express, json } from 'express';
import 'reflect-metadata';
import { DITypes } from './DITypes';
import { IConfigService } from './config/config.service.interface';
import { ILoggerService } from './logger/logger.service.interface';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { PrismaService } from './database/prisma.service';
import { IAuthController } from './auth/interfaces/auth.controller.interface';
import cookieParser from 'cookie-parser';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;
	constructor(
		@inject(DITypes.ConfigService) private configService: IConfigService,
		@inject(DITypes.LoggerService) private loggerService: ILoggerService,
		@inject(DITypes.ExceptionFilter) private exceptionFilter: IExceptionFilter,
		// @inject(DITypes.UsersController) private usersController: UsersController,
		@inject(DITypes.AuthController) private authController: IAuthController,
		@inject(DITypes.PrismaService) private prismaService: PrismaService,
	) {
		this.app = express();
		this.port = Number(this.configService.get('PORT'));
	}

	useMiddleware(): void {
		this.app.use(json());
		this.app.use(cookieParser());
	}

	useRoutes(): void {
		this.app.use('/users', this.authController.router);
	}

	useExceptionFilter(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExceptionFilter();
		await this.prismaService.connect();
		this.server = this.app.listen(this.port);
		this.loggerService.log(`Server started on port: ${this.port}`);
	}

	public close(): void {
		this.server.close();
	}
}
