/* eslint-disable no-unused-vars */

import type { User } from '@prisma/client';

import type { UsersRepository } from '~/repositories/users-repository';

import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface GetUserProfileUseCaseRequest {
	userId: string;
}

interface GetUserProfileUseCaseResponse {
	user: User;
}

export class GetUserProfileUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute(
		data: GetUserProfileUseCaseRequest,
	): Promise<GetUserProfileUseCaseResponse> {
		const user = await this.usersRepository.findById(data.userId);

		if (!user) throw new ResourceNotFoundError();

		return {
			user,
		};
	}
}
