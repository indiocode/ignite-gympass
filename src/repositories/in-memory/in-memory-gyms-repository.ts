import type { Gym, Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { randomUUID } from 'crypto';

import { getDistanceBetweenCoordinates } from '~/utils/get-distance-between-coodinates';

import type { FindManyNearbyParams, GymsRepository } from '../gyms-repository';

export class InMemoryGymsRepository implements GymsRepository {
	public items: Gym[] = [];

	async create(data: Prisma.GymCreateInput): Promise<Gym> {
		const gym: Gym = {
			id: data.id ?? randomUUID(),
			description: data.description ?? null,
			phone: data.phone ?? null,
			title: data.title,
			latitude: new Decimal(data.latitude.toString()),
			longitude: new Decimal(data.longitude.toString()),
		};

		this.items.push(gym);

		return gym;
	}

	async findById(id: string): Promise<Gym | null> {
		const gym = this.items.find((gym) => gym.id === id);

		if (!gym) return null;

		return gym;
	}

	async searchMany(query: string, page: number): Promise<Gym[]> {
		return this.items
			.filter((item) => item.title.includes(query))
			.slice((page - 1) * 20, page * 20);
	}

	async findManyNearby(params: FindManyNearbyParams): Promise<Gym[]> {
		return this.items.filter((item) => {
			const distance = getDistanceBetweenCoordinates(
				{
					latitude: params.latitude,
					longitude: params.longitude,
				},
				{
					latitude: item.latitude.toNumber(),
					longitude: item.longitude.toNumber(),
				},
			);

			return distance < 10;
		});
	}
}
