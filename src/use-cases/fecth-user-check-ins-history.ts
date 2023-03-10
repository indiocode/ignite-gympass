/* eslint-disable no-unused-vars */

import type { CheckIn } from '@prisma/client';

import type { CheckInsRepository } from '~/repositories/check-ins-repository';

interface FetchUserChekInsHistoryUseCaseRequest {
	userId: string;
	page: number;
}

interface FetchUserChekInsHistoryUseCaseResponse {
	checkIns: CheckIn[];
}

export class FetchUserChekInsHistoryUseCase {
	constructor(private checkInsRepository: CheckInsRepository) {}

	async execute(
		data: FetchUserChekInsHistoryUseCaseRequest,
	): Promise<FetchUserChekInsHistoryUseCaseResponse> {
		const checkIns = await this.checkInsRepository.findByManyByUserId(
			data.userId,
			data.page,
		);

		return {
			checkIns,
		};
	}
}
