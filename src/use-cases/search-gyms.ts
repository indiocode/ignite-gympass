/* eslint-disable no-unused-vars */
import type { Gym } from '@prisma/client';

import type { GymsRepository } from '~/repositories/gyms-repository';

interface SearchGymsUseCaseRequest {
	query: string;
	page: number;
}

interface SearchGymsUseCaseResponse {
	gyms: Gym[];
}

export class SearchGymsUseCase {
	constructor(private gymsRepository: GymsRepository) {}

	async execute(
		data: SearchGymsUseCaseRequest,
	): Promise<SearchGymsUseCaseResponse> {
		const gyms = await this.gymsRepository.searchMany(data.query, data.page);

		return {
			gyms,
		};
	}
}
