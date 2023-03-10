/* eslint-disable no-unused-vars */
import type { CheckIn } from '@prisma/client';
import dayjs from 'dayjs';

import type { CheckInsRepository } from '~/repositories/check-ins-repository';

import { LateCheckInValidationError } from './errors/late-check-in-validation-error';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface ValidateCheckInUseCaseRequest {
	checkInId: string;
}

interface ValidateCheckInUseCaseResponse {
	checkIn: CheckIn;
}

export class ValidateCheckInUseCase {
	constructor(private checkInsRepository: CheckInsRepository) {}

	async execute(
		data: ValidateCheckInUseCaseRequest,
	): Promise<ValidateCheckInUseCaseResponse> {
		const checkIn = await this.checkInsRepository.findById(data.checkInId);

		if (!checkIn) throw new ResourceNotFoundError();

		const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
			checkIn.created_at,
			'minutes',
		);

		if (distanceInMinutesFromCheckInCreation > 20)
			throw new LateCheckInValidationError();

		checkIn.validated_at = new Date();

		await this.checkInsRepository.save(checkIn);

		return {
			checkIn,
		};
	}
}
