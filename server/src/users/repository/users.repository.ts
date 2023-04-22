import { DITypes } from '../../DITypes';
import { inject, injectable } from 'inversify';
import { PrismaService } from '../../database/prisma.service';
import { IUsersRepository } from './users.repository.interface';
import { UserEntity } from '../user.entity';
import { User } from '@prisma/client';

@injectable()
export class UsersRepository implements IUsersRepository {
	constructor(@inject(DITypes.PrismaService) private prismaService: PrismaService) {}
	async create(user: UserEntity): Promise<User | null> {
		const newUser = await this.prismaService.client.user.create({
			data: {
				email: user.email,
				firstName: user.firstName,
				secondName: user.secondName,
				password: user.password,
			},
		});
		if (newUser) {
			return newUser;
		} else {
			return null;
		}
	}

	async getByEmail(email: string): Promise<User | null> {
		return this.prismaService.client.user.findFirst({
			where: {
				email,
			},
		});
	}
}
