/* eslint-disable no-unused-vars */
import type { User } from '@prisma/client';
import { compare } from 'bcryptjs';

import type { UsersRepository } from '~/repositories/users-repository';

import { InvalidCredentialsError } from './errors/invalid-credentials-error';

interface AuthenticateUseCaseRequest {
	email: string;
	password: string;
}

interface AuthenticateUseCaseResponse {
	user: User;
}

export class AuthenticateUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute(
		data: AuthenticateUseCaseRequest,
	): Promise<AuthenticateUseCaseResponse> {
		const user = await this.usersRepository.findByEmail(data.email);

		if (!user) throw new InvalidCredentialsError();

		const doesPasswordMatchs = await compare(data.password, user.password_hash);

		if (!doesPasswordMatchs) throw new InvalidCredentialsError();

		return {
			user,
		};
	}
}
