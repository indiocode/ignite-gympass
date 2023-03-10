/* eslint-disable no-unused-vars */
import type { CheckIn } from '@prisma/client';

import type { CheckInsRepository } from '~/repositories/check-ins-repository';
import type { GymsRepository } from '~/repositories/gyms-repository';
import { getDistanceBetweenCoordinates } from '~/utils/get-distance-between-coodinates';

import { MaxDistanceError } from './errors/max-distance-error';
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface CheckInUseCaseRequest {
	userId: string;
	gymId: string;
	user: {
		latitude: number;
		longitude: number;
	};
}

interface CheckInUseCaseResponse {
	checkIn: CheckIn;
}

export class CheckInUseCase {
	constructor(
		private checkInsRepository: CheckInsRepository,
		private gymsRepository: GymsRepository,
	) {}

	async execute(data: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
		const gym = await this.gymsRepository.findById(data.gymId);

		if (!gym) throw new ResourceNotFoundError();

		const distance = getDistanceBetweenCoordinates(
			{ latitude: data.user.latitude, longitude: data.user.longitude },
			{
				latitude: gym.latitude.toNumber(),
				longitude: gym.longitude.toNumber(),
			},
		);

		const MAX_DISTANCE_IN_KILEMETERS = 0.1;

		if (distance > MAX_DISTANCE_IN_KILEMETERS) {
			throw new MaxDistanceError();
		}

		const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
			data.userId,
			new Date(),
		);

		if (checkInOnSameDay) throw new MaxNumberOfCheckInsError();

		const checkIn = await this.checkInsRepository.create({
			gym_id: data.gymId,
			user_id: data.userId,
		});

		return {
			checkIn,
		};
	}
}
