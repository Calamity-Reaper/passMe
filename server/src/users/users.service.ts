import { IUsersService } from './interfaces/users.service.interface';
import { inject, injectable } from 'inversify';
import { DITypes } from '../DITypes';
import { IConfigService } from '../config/config.service.interface';
import { UserEntity } from './user.entity';
import { IUsersRepository } from './repository/users.repository.interface';
import { User } from '@prisma/client';
import { AuthLoginDto } from '../auth/dto/auth-login.dto';
import { IUserCreation } from './interfaces/user-creation.interface';

@injectable()
export class UsersService implements IUsersService {
	constructor(
		@inject(DITypes.ConfigService) private configService: IConfigService,
		@inject(DITypes.UsersRepository) private usersRepository: IUsersRepository,
	) {}

	async isUserExist(email: string): Promise<boolean> {
		return !!(await this.usersRepository.getByEmail(email));
	}
	async createUser({
		password,
		email,
		firstName,
		secondName,
	}: IUserCreation): Promise<User | null> {
		const newUser = new UserEntity(email, firstName, secondName, password);
		return await this.usersRepository.create(newUser);
	}

	async findByEmail(email: string): Promise<User | null> {
		const user = await this.usersRepository.getByEmail(email);
		if (user) {
			return user;
		} else {
			return null;
		}
	}
}
