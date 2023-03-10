import { hash } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';

import { InMemoryUsersRepository } from '~/repositories/in-memory/in-memory-users-repository';

import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { GetUserProfileUseCase } from './get-user-profile';

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe('Get User Profile Use Case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		sut = new GetUserProfileUseCase(usersRepository);
	});

	it('shold be able to get user profile', async () => {
		const createdUser = await usersRepository.create({
			name: 'John Smith',
			email: 'john.smith@gmail',
			password_hash: await hash('password', 6),
		});

		const { user } = await sut.execute({ userId: createdUser.id });

		expect(user).toHaveProperty('id');
		expect(user.id).toEqual(expect.any(String));
		expect(user.name).toEqual(expect.any(String));
	});

	it('shold not be able to get user profile with wrong id', async () => {
		await expect(() =>
			sut.execute({ userId: 'non-existing-id' }),
		).rejects.toBeInstanceOf(ResourceNotFoundError);
	});
});
