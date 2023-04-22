import { AuthRegisterDto } from '../../auth/dto/auth-register.dto';
import { User } from '@prisma/client';

export interface IUsersService {
	isUserExist: (email: string) => Promise<boolean>;
	createUser: (user: AuthRegisterDto) => Promise<User | null>;

	findByEmail: (email: string) => Promise<User | null>;
}
