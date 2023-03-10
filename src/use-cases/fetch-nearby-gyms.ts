/* eslint-disable no-unused-vars */
import type { Gym } from '@prisma/client';

import type { GymsRepository } from '~/repositories/gyms-repository';

interface FetchNearbyGymsUseCaseRequest {
	user: {
		latitude: number;
		longitude: number;
	};
}

interface FetchNearbyGymsUseCaseResponse {
	gyms: Gym[];
}

export class FetchNearbyGymsUseCase {
	constructor(private gymsRepository: GymsRepository) {}

	async execute(
		data: FetchNearbyGymsUseCaseRequest,
	): Promise<FetchNearbyGymsUseCaseResponse> {
		const gyms = await this.gymsRepository.findManyNearby({
			latitude: data.user.latitude,
			longitude: data.user.longitude,
		});

		return {
			gyms,
		};
	}
}
