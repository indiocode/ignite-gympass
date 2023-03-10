import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { InMemoryCheckInsRepository } from '~/repositories/in-memory/in-memory-check-ins-repository';
import { InMemoryGymsRepository } from '~/repositories/in-memory/in-memory-gyms-repository';

import { CheckInUseCase } from './check-in';
import { MaxDistanceError } from './errors/max-distance-error';
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error';

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe('Check In Use Case', () => {
	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository();
		gymsRepository = new InMemoryGymsRepository();
		sut = new CheckInUseCase(checkInsRepository, gymsRepository);

		await gymsRepository.create({
			id: 'gym-01',
			title: 'Gym',
			description: '',
			latitude: -27.2092052,
			longitude: -49.6401091,
			phone: '',
		});

		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('shold be able to check in', async () => {
		const { checkIn } = await sut.execute({
			gymId: 'gym-01',
			userId: 'user-01',
			user: {
				latitude: -27.2092052,
				longitude: -49.6401091,
			},
		});

		expect(checkIn).toHaveProperty('id');
		expect(checkIn.id).toEqual(expect.any(String));
	});

	it('shold not be able to check in twice in the same day', async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

		await sut.execute({
			gymId: 'gym-01',
			userId: 'user-01',
			user: {
				latitude: -27.2092052,
				longitude: -49.6401091,
			},
		});

		await expect(() =>
			sut.execute({
				gymId: 'gym-01',
				userId: 'user-01',
				user: {
					latitude: -27.2092052,
					longitude: -49.6401091,
				},
			}),
		).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
	});

	it('shold be able to check in twice but in different days', async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

		await sut.execute({
			gymId: 'gym-01',
			userId: 'user-01',
			user: {
				latitude: -27.2092052,
				longitude: -49.6401091,
			},
		});

		vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

		const { checkIn } = await sut.execute({
			gymId: 'gym-01',
			userId: 'user-01',
			user: {
				latitude: -27.2092052,
				longitude: -49.6401091,
			},
		});

		expect(checkIn).toHaveProperty('id');
		expect(checkIn.id).toEqual(expect.any(String));
	});

	it('shold not be able to check in on distant gym', async () => {
		await expect(() =>
			sut.execute({
				gymId: 'gym-01',
				userId: 'user-01',
				user: {
					latitude: -27.0747279,
					longitude: -49.4889672,
				},
			}),
		).rejects.toBeInstanceOf(MaxDistanceError);
	});
});
