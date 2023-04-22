import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthRegisterDto {
	@IsEmail({}, { message: 'Invalid email address' })
	email: string;
	@IsString({ message: 'First name must be a string' })
	@IsNotEmpty({ message: 'First name is mandatory' })
	firstName: string;
	@IsString({ message: 'Second name must be a string' })
	@IsNotEmpty({ message: 'Second name is mandatory' })
	secondName: string;
	@IsString({ message: 'Password must be a string' })
	@MinLength(12, { message: 'Password must be longer than 12 symbols' })
	password: string;
}
