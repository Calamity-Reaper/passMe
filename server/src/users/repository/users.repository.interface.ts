import { UserEntity } from '../user.entity';
import { User } from '@prisma/client';

export interface IUsersRepository {
	create: (user: UserEntity) => Promise<User | null>;
	// getById: (id: number) => Promise<User | null>;
	getByEmail: (email: string) => Promise<User | null>;
	// getAll: () => Promise<User[] | null>;
	// delete: (id: number) => Promise<boolean>;
}
