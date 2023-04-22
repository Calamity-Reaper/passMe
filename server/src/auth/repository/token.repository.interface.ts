import { Token } from '@prisma/client';

export interface ITokenRepository {
	create: (userId: number, refreshToken: string) => Promise<void>;
	updateOrCreateToken: (userId: number, refreshToken: string) => Promise<void>;
	deleteToken: (refreshToken: string) => Promise<void>;
}
