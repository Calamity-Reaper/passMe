import { ILoggerService } from '../logger/logger.service.interface';
import { DITypes } from '../DITypes';
import { inject, injectable } from 'inversify';
import { IExceptionFilter } from './exception.filter.interface';
import { HttpError } from './http-error.class';
import { NextFunction, Request, Response } from 'express';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
	constructor(@inject(DITypes.LoggerService) private LoggerService: ILoggerService) {}

	catch(err: Error | HttpError, req: Request, res: Response, next: NextFunction): void {
		if (err instanceof HttpError) {
			this.LoggerService.error(`[${err.context}] Error ${err.statusCode}: ${err.message}`);
			res.status(err.statusCode).send({ err: err.message });
		} else {
			this.LoggerService.error(` Error: ${err.message}`);
			res.status(500).send({ err: err.message });
		}
	}
}
