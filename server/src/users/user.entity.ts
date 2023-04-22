import { compare, genSalt, hash } from 'bcryptjs';

export class UserEntity {
	constructor(
		private readonly _email: string,
		private readonly _firstName: string,
		private readonly _secondName: string,
		private readonly _password: string,
	) {}

	get password(): string {
		return this._password;
	}

	get email(): string {
		return this._email;
	}

	get firstName(): string {
		return this._firstName;
	}

	get secondName(): string {
		return this._secondName;
	}

	// public async setPassword(pass: string, salt: number): Promise<void | null> {
	// 	this._password = await hash(pass, await genSalt(salt));
	// }
	//
	// public async validatePassword(pass: string): Promise<boolean> {
	// 	return await compare(pass, this._password);
	// }
}
