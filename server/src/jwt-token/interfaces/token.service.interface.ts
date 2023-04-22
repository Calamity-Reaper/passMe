import { JwtPayloadDto } from '../dto/jwt-payload.dto';
import { ITokens } from './tokens.interface';

export interface ITokenService {
	generateTokens: (payload: JwtPayloadDto) => ITokens;

	validateAccessToken: (token: string) => JwtPayloadDto | null;
	validateRefreshToken: (token: string) => JwtPayloadDto | null;
	refreshTokens: (refreshToken: string, newPayload: JwtPayloadDto) => Promise<ITokens>;
	isTokenExist: (refreshToken: string) => Promise<boolean>;
	addToken: (userId: number, refreshToken: string) => Promise<void>;
	updateToken: (userId: number, refreshToken: string) => Promise<void>;
	deleteToken: (refreshToken: string) => Promise<void>;
}
