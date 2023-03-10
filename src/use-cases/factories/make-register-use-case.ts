import { PrismaUsersRepository } from '~/repositories/prisma/prisma-users-repository';

import { RegisterUseCase } from '../register';

export function makeRegisterUseCase(): RegisterUseCase {
	const usersRepository = new PrismaUsersRepository();
	const useCase = new RegisterUseCase(usersRepository);

	return useCase;
}
