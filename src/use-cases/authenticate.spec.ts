import { hash } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';

import { InMemoryUsersRepository } from '~/repositories/in-memory/in-memory-users-repository';

import { AuthenticateUseCase } from './authenticate';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe('Authenticate Use Case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		sut = new AuthenticateUseCase(usersRepository);
	});

	it('shold be able to authenticate', async () => {
		await usersRepository.create({
			name: 'John Smith',
			email: 'john.smith@gmail',
			password_hash: await hash('password', 6),
		});

		const { user } = await sut.execute({
			email: 'john.smith@gmail',
			password: 'password',
		});

		expect(user).toHaveProperty('id');
		expect(user.id).toEqual(expect.any(String));
	});

	it('shold be able to authenticate with wrong email', async () => {
		await expect(() =>
			sut.execute({
				email: 'john.smith@gmail',
				password: 'password',
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});

	it('shold be able to authenticate with wrong password', async () => {
		await usersRepository.create({
			name: 'John Smith',
			email: 'john.smith@gmail',
			password_hash: await hash('password', 6),
		});

		await expect(() =>
			sut.execute({
				email: 'john.smith@gmail',
				password: 'password12',
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});
});
