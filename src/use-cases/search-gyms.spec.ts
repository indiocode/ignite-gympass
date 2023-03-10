import { beforeEach, describe, expect, it } from 'vitest';

import { InMemoryGymsRepository } from '~/repositories/in-memory/in-memory-gyms-repository';

import { SearchGymsUseCase } from './search-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe('Search Gyms Use Case', () => {
	beforeEach(async () => {
		gymsRepository = new InMemoryGymsRepository();
		sut = new SearchGymsUseCase(gymsRepository);
	});

	it('shold be able to search for gyms', async () => {
		await gymsRepository.create({
			title: 'Gym-01',
			description: null,
			phone: null,
			latitude: -27.2092052,
			longitude: -49.6401091,
		});

		await gymsRepository.create({
			title: 'Gym-02',
			description: null,
			phone: null,
			latitude: -27.2092052,
			longitude: -49.6401091,
		});

		const { gyms } = await sut.execute({
			query: '02',
			page: 1,
		});

		expect(gyms).toHaveLength(1);
		expect(gyms).toEqual([expect.objectContaining({ title: 'Gym-02' })]);
	});

	it('shold be able to fetch paginated gyms search', async () => {
		for (let index = 1; index <= 22; index++) {
			await gymsRepository.create({
				title: `Gym-${index}`,
				description: null,
				phone: null,
				latitude: -27.2092052,
				longitude: -49.6401091,
			});
		}

		const { gyms } = await sut.execute({
			query: 'Gym',
			page: 2,
		});

		expect(gyms).toHaveLength(2);
		expect(gyms).toEqual([
			expect.objectContaining({ title: 'Gym-21' }),
			expect.objectContaining({ title: 'Gym-22' }),
		]);
	});
});
