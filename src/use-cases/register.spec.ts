import { compare } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';

import { InMemoryUsersRepository } from '~/repositories/in-memory/in-memory-users-repository';

import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { RegisterUseCase } from './register';

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe('Register Use Case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		sut = new RegisterUseCase(usersRepository);
	});

	it('shold be able to register', async () => {
		const { user } = await sut.execute({
			name: 'John Smith',
			email: 'john.smith@gmail',
			password: 'password',
		});

		expect(user).toHaveProperty('id');
		expect(user.id).toEqual(expect.any(String));
	});

	it('shold hash user password upon registration', async () => {
		const { user } = await sut.execute({
			name: 'John Smith',
			email: 'john.smith@gmail',
			password: 'password',
		});

		const isPasswordCorrectlyHashed = await compare(
			'password',
			user.password_hash,
		);

		expect(isPasswordCorrectlyHashed).toBe(true);
	});

	it('shold not be able to register with same email twice', async () => {
		await sut.execute({
			name: 'John Smith',
			email: 'john.smith@gmail',
			password: 'password',
		});

		await expect(() =>
			sut.execute({
				name: 'John Smith',
				email: 'john.smith@gmail',
				password: 'password',
			}),
		).rejects.toBeInstanceOf(UserAlreadyExistsError);
	});
});
