/* eslint-disable no-unused-vars */
import type { CheckIn, Prisma } from '@prisma/client';

export interface CheckInsRepository {
	create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>;
	save(checkIn: CheckIn): Promise<CheckIn>;
	findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>;
	findByManyByUserId(userId: string, page: number): Promise<CheckIn[]>;
	findById(id: string): Promise<CheckIn | null>;
	countByUserId(userId: string): Promise<number>;
}