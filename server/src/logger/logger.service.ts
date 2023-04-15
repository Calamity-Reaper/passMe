import { ILoggerService } from './logger.service.interface';
import { ILogObj, Logger } from 'tslog';
import { injectable } from 'inversify';

@injectable()
export class LoggerService implements ILoggerService {
	public logger: Logger<ILogObj>;
	constructor() {
		this.logger = new Logger<ILogObj>();
	}

	log(...args: unknown[]): void {
		this.logger.info(...args);
	}
	warn(...args: unknown[]): void {
		this.logger.warn(...args);
	}
	error(...args: unknown[]): void {
		this.logger.error(...args);
	}
}
