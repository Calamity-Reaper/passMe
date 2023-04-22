import { ITokenRepository } from './token.repository.interface';
import { DITypes } from '../../DITypes';
import { inject, injectable } from 'inversify';
import { PrismaService } from '../../database/prisma.service';
import { HttpError } from '../../errors/http-error.class';

@injectable()
export class TokenRepository implements ITokenRepository {
	constructor(@inject(DITypes.PrismaService) private prismaService: PrismaService) {}
	async create(userId: number, refreshToken: string): Promise<void> {
		await this.prismaService.client.token.upsert({
			where: { userId },
			update: { token: refreshToken },
			create: { userId, token: refreshToken },
		});
	}
	async updateOrCreateToken(userId: number, refreshToken: string): Promise<void> {
		await this.prismaService.client.token.upsert({
			where: { userId },
			update: { token: refreshToken },
			create: { userId, token: refreshToken },
		});
	}

	async deleteToken(refreshToken: string): Promise<void> {
		try {
			await this.prismaService.client.token.delete({
				where: { token: refreshToken },
			});
		} catch (e) {
			throw new HttpError(422, 'No such token');
		}
	}
}
