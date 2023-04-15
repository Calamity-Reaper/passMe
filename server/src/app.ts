import { inject, injectable } from 'inversify';
import { Server } from 'http';
import express, { Express, json } from 'express';
import 'reflect-metadata';
import { DITypes } from './DITypes';
import { IConfigService } from './config/config.service.interface';
import { ILoggerService } from './logger/logger.service.interface';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;
	constructor(
		@inject(DITypes.ConfigService) private configService: IConfigService,
		@inject(DITypes.LoggerService) private loggerService: ILoggerService,
	) {
		this.app = express();
		this.port = Number(this.configService.get('PORT'));
	}

	useMiddleware(): void {
		this.app.use(json());
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.server = this.app.listen(this.port);
		this.loggerService.log(`Server started on port: ${this.port}`);
	}

	public close(): void {
		this.server.close();
	}
}
