import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { IConfigService } from '../config/config.service.interface';
import { DITypes } from '../DITypes';
import { inject, injectable } from 'inversify';
import { sign } from 'jsonwebtoken';
import { ITokenRepository } from './repository/token.repository.interface';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { IUsersService } from '../users/interfaces/users.service.interface';
import { compare, genSalt, hash } from 'bcryptjs';
import { IAuthService, ILoginUser, ITokens } from './interfaces/auth.service.interface';
import { AuthLoginDto } from './dto/auth-login.dto';
import { HttpError } from '../errors/http-error.class';

@injectable()
export class AuthService implements IAuthService {
	constructor(
		@inject(DITypes.ConfigService) private configService: IConfigService,
		@inject(DITypes.TokenRepository) private tokenRepository: ITokenRepository,
		@inject(DITypes.UsersService) private usersService: IUsersService,
	) {}
	private generateTokens(payload: JwtPayloadDto): ITokens {
		const access = sign(payload, this.configService.get('JWT_ACCESS_SECRET'), { expiresIn: '30m' });
		const refresh = sign(payload, this.configService.get('JWT_REFRESH_SECRET'), {
			expiresIn: '6h',
		});
		return { access, refresh };
	}

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
		const tokens = this.generateTokens({ id: user.id, email: user.email });
		await this.tokenRepository.create(user.id, tokens.refresh);
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
		const tokens = this.generateTokens({ id: user.id, email: user.email });

		await this.tokenRepository.updateOrCreateToken(user.id, tokens.refresh);
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
		await this.tokenRepository.deleteToken(token);
	}
}
