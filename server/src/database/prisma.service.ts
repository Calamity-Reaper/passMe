import { PrismaClient } from '@prisma/client';
import { ILoggerService } from '../logger/logger.service.interface';
import { DITypes } from '../DITypes';
import { inject, injectable } from 'inversify';

@injectable()
export class PrismaService {
	client: PrismaClient;
	constructor(@inject(DITypes.LoggerService) private loggerService: ILoggerService) {
		this.client = new PrismaClient();
	}

	async connect(): Promise<void> {
		try {
			await this.client.$connect();
			this.loggerService.log('[PrismaService] Connection to DB is success');
		} catch (e) {
			if (e instanceof Error) {
				this.loggerService.error('[PrismaService] Connection to DB field with error: ' + e.message);
			}
		}
	}

	async disconnect(): Promise<void> {
		await this.client.$disconnect();
	}
}
