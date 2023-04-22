import { JwtPayloadDto } from '../../jwt-token/dto/jwt-payload.dto';
import { AuthRegisterDto } from '../dto/auth-register.dto';
import { AuthLoginDto } from '../dto/auth-login.dto';
import { ITokens } from '../../jwt-token/interfaces/tokens.interface';

export interface ILoginUser extends ITokens {
	user: Omit<AuthRegisterDto, 'password'>;
}
export interface IAuthService {
	registerNewUser: (userData: AuthRegisterDto) => Promise<ILoginUser>;
	loginUser: (userData: AuthLoginDto) => Promise<ILoginUser>;
	logoutUser: (token: string) => Promise<void>;
	refresh: (token: string) => Promise<ILoginUser>;
}
