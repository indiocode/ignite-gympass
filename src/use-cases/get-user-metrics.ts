/* eslint-disable no-unused-vars */

import type { CheckInsRepository } from '~/repositories/check-ins-repository';

interface GetUserMetricsUseCaseRequest {
	userId: string;
}

interface GetUserMetricsUseCaseResponse {
	checkInsCount: number;
}

export class GetUserMetricsUseCase {
	constructor(private checkInsRepository: CheckInsRepository) {}

	async execute(
		data: GetUserMetricsUseCaseRequest,
	): Promise<GetUserMetricsUseCaseResponse> {
		const checkInsCount = await this.checkInsRepository.countByUserId(
			data.userId,
		);

		return {
			checkInsCount,
		};
	}
}
