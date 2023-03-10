/* eslint-disable no-unused-vars */
import type { User } from '@prisma/client';
import { hash } from 'bcryptjs';

import type { UsersRepository } from '~/repositories/users-repository';

import { UserAlreadyExistsError } from './errors/user-already-exists-error';

interface RegisterUseCaseRequest {
	name: string;
	email: string;
	password: string;
}

interface RegisterUseCaseResponse {
	user: User;
}

export class RegisterUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute(
		data: RegisterUseCaseRequest,
	): Promise<RegisterUseCaseResponse> {
		const password_hash = await hash(data.password, 6);

		const userWithSameEmail = await this.usersRepository.findByEmail(
			data.email,
		);

		if (userWithSameEmail) throw new UserAlreadyExistsError();

		const user = await this.usersRepository.create({
			email: data.email,
			name: data.name,
			password_hash,
		});

		return {
			user,
		};
	}
}
