import { IConfigService } from '../config/config.service.interface';
import { DITypes } from '../DITypes';
import { inject, injectable } from 'inversify';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { IUsersService } from '../users/interfaces/users.service.interface';
import { compare, genSalt, hash } from 'bcryptjs';
import { IAuthService, ILoginUser } from './interfaces/auth.service.interface';
import { AuthLoginDto } from './dto/auth-login.dto';
import { HttpError } from '../errors/http-error.class';
import { ITokenService } from '../jwt-token/interfaces/token.service.interface';

@injectable()
export class AuthService implements IAuthService {
	constructor(
		@inject(DITypes.ConfigService) private configService: IConfigService,
		@inject(DITypes.UsersService) private usersService: IUsersService,
		@inject(DITypes.TokenService) private tokenService: ITokenService,
	) {}

	private async hashPassword(password: string): Promise<string> {
		const salt = Number(this.configService.get('SALT'));
		return await hash(password, await genSalt(salt));
	}

	private async validatePassword(hashedPass: string, pass: string): Promise<boolean> {
		return await compare(pass, hashedPass);
	}

	async registerNewUser(userData: AuthRegisterDto): Promise<ILoginUser> {
		if (await this.usersService.isUserExist(userData.email)) {
			throw new HttpError(401, 'Such user is already exist');
		}
		const hashedPassword = await this.hashPassword(userData.password);
		const user = await this.usersService.createUser({ ...userData, password: hashedPassword });
		if (!user) {
			throw new Error('User creation error');
		}
		const tokens = this.tokenService.generateTokens({ id: user.id, email: user.email });
		await this.tokenService.addToken(user.id, tokens.refresh);
		return {
			user: {
				email: user.email,
				firstName: user.firstName,
				secondName: user.secondName,
			},
			...tokens,
		};
	}

	async loginUser(userData: AuthLoginDto): Promise<ILoginUser> {
		const user = await this.usersService.findByEmail(userData.email);
		if (!user) {
			throw new HttpError(401, 'Incorrect email or password');
		}
		if (!(await this.validatePassword(user.password, userData.password))) {
			throw new HttpError(401, 'Incorrect email or password');
		}
		const tokens = this.tokenService.generateTokens({ id: user.id, email: user.email });

		await this.tokenService.updateToken(user.id, tokens.refresh);
		return {
			user: {
				email: user.email,
				firstName: user.firstName,
				secondName: user.secondName,
			},
			...tokens,
		};
	}

	async logoutUser(token: string): Promise<void> {
		await this.tokenService.deleteToken(token);
	}

	async refresh(token: string): Promise<ILoginUser> {
		if (!token) {
			throw new HttpError(401, 'User is not authorized');
		}
		const payload = this.tokenService.validateRefreshToken(token);
		if (!payload || !(await this.tokenService.isTokenExist(token))) {
			throw new HttpError(401, 'User is not authorized');
		}
		const user = await this.usersService.findByEmail(payload.email);
		if (!user) {
			throw new HttpError(401, 'User is not authorized');
		}
		const tokens = await this.tokenService.refreshTokens(token, { email: user.email, id: user.id });
		return {
			user: {
				email: user.email,
				firstName: user.firstName,
				secondName: user.secondName,
			},
			...tokens,
		};
	}
}
