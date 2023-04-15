import { inject, injectable } from 'inversify';
import { IConfigService } from './config.service.interface';
import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { ILoggerService } from '../logger/logger.service.interface';
import { DITypes } from '../DITypes';

@injectable()
export class ConfigService implements IConfigService {
	private config: DotenvParseOutput;
	constructor(@inject(DITypes.LoggerService) private loggerService: ILoggerService) {
		const result: DotenvConfigOutput = config();
		if (result.error) {
			this.loggerService.error('[ConfigService] .env file could not be read or is missing');
		} else {
			this.loggerService.log('[ConfigService] .env configuration loaded');
			this.config = result.parsed as DotenvParseOutput;
		}
	}
	get(key: string): string {
		return this.config[key];
	}
}
