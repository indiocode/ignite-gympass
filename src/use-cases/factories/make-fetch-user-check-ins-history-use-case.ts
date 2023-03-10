import { PrismaCheckInsRepository } from '~/repositories/prisma/prisma-check-ins-repository';

import { FetchUserChekInsHistoryUseCase } from '../fecth-user-check-ins-history';

export function makeFetchUserCheckInsHistoryUseCase(): FetchUserChekInsHistoryUseCase {
	const checkInsRepository = new PrismaCheckInsRepository();
	const useCase = new FetchUserChekInsHistoryUseCase(checkInsRepository);

	return useCase;
}
