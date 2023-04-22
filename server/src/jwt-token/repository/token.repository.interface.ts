export interface ITokenRepository {
	create: (userId: number, refreshToken: string) => Promise<void>;
	updateOrCreateToken: (userId: number, refreshToken: string) => Promise<void>;
	deleteToken: (refreshToken: string) => Promise<void>;
	findToken: (refreshToken: string) => Promise<boolean>;
}
