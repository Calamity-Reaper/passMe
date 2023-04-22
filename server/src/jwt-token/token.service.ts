import { ITokenService } from './interfaces/token.service.interface';
import { inject, injectable } from 'inversify';
import { DITypes } from '../DITypes';
import { IConfigService } from '../config/config.service.interface';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { ITokens } from './interfaces/tokens.interface';
import { sign, verify } from 'jsonwebtoken';
import { ITokenRepository } from './repository/token.repository.interface';
import { HttpError } from '../errors/http-error.class';
@injectable()
export class TokenService implements ITokenService {
	constructor(
		@inject(DITypes.ConfigService) private configService: IConfigService,
		@inject(DITypes.TokenRepository) private tokenRepository: ITokenRepository,
	) {}

	generateTokens(payload: JwtPayloadDto): ITokens {
		const access = sign(payload, this.configService.get('JWT_ACCESS_SECRET'), { expiresIn: '30m' });
		const refresh = sign(payload, this.configService.get('JWT_REFRESH_SECRET'), {
			expiresIn: '6h',
		});
		return { access, refresh };
	}

	async addToken(userId: number, refreshToken: string): Promise<void> {
		await this.tokenRepository.create(userId, refreshToken);
	}

	async updateToken(userId: number, refreshToken: string): Promise<void> {
		await this.tokenRepository.updateOrCreateToken(userId, refreshToken);
	}

	async deleteToken(refreshToken: string): Promise<void> {
		await this.tokenRepository.deleteToken(refreshToken);
	}

	async isTokenExist(refreshToken: string): Promise<boolean> {
		return await this.tokenRepository.findToken(refreshToken);
	}

	validateAccessToken(token: string): JwtPayloadDto | null {
		try {
			const userJwtData = verify(token, this.configService.get('JWT_ACCESS_SECRET'));
			return userJwtData as JwtPayloadDto;
		} catch (e) {
			return null;
		}
	}

	validateRefreshToken(token: string): JwtPayloadDto | null {
		try {
			const userJwtData = verify(token, this.configService.get('JWT_REFRESH_SECRET'));
			return userJwtData as JwtPayloadDto;
		} catch (e) {
			return null;
		}
	}

	async refreshTokens(refreshToken: string, newPayload: JwtPayloadDto): Promise<ITokens> {
		const tokens = this.generateTokens(newPayload);
		await this.updateToken(newPayload.id, tokens.refresh);
		return tokens;
	}
}
