import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../../common/base.controller';

export interface IAuthController extends BaseController {
	registration: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	logout: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
