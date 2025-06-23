import { Test, TestingModule } from '@nestjs/testing';
import { LikesService } from './likes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Likes } from './likes.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { NotFoundException, Logger } from '@nestjs/common';

const mockGlobalFetch = jest.fn();

describe('LikesService', () => {
	let service: LikesService;
	let likesRepository: Repository<Likes>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				LikesService,
				{
					provide: getRepositoryToken(Likes),
					useClass: Repository
				},
				{
					provide: ConfigService,
					useValue: {
						getOrThrow: jest.fn().mockReturnValue('mock-api-key')
					}
				},
				{
					provide: Logger,
					useValue: {
						log: jest.fn(),
						warn: jest.fn()
					}
				}
			]
		}).compile();

		service = module.get(LikesService);
		likesRepository = module.get(getRepositoryToken(Likes));

		jest.spyOn(global, 'fetch').mockImplementation(mockGlobalFetch);
		mockGlobalFetch.mockClear();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('getAll', () => {
		it('should return all likes for a user', async () => {
			const userId = 1;
			const mockLikes = [{ cat_id: 'cat1', created_at: new Date() }];
			jest
				.spyOn(likesRepository, 'find')
				.mockResolvedValue(mockLikes as Likes[]);

			const result = await service.getAll(userId);

			expect(likesRepository.find).toHaveBeenCalledWith({
				where: { user_id: userId },
				select: { cat_id: true, created_at: true },
				order: { created_at: 'DESC' }
			});
			expect(result).toEqual({ data: mockLikes });
		});
	});

	describe('add', () => {
		const userId = 1;
		const catId = 'cat1';

		it('should add a like successfully', async () => {
			mockGlobalFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ id: catId })
			});
			jest.spyOn(likesRepository, 'save').mockResolvedValue(undefined);

			await service.add(userId, catId);

			expect(mockGlobalFetch).toHaveBeenCalledWith(
				`https://api.thecatapi.com/v1/images/${catId}`,
				{
					headers: { 'x-api-key': 'mock-api-key' }
				}
			);
			expect(likesRepository.save).toHaveBeenCalledWith({
				cat_id: catId,
				user_id: userId
			});
		});

		it('should throw NotFoundException if cat not found in external API', async () => {
			mockGlobalFetch.mockResolvedValueOnce({
				ok: false
			});

			await expect(service.add(userId, catId)).rejects.toThrow(
				NotFoundException
			);
		});

		it('should throw NotFoundException if cat data is invalid', async () => {
			mockGlobalFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({})
			});

			await expect(service.add(userId, catId)).rejects.toThrow(
				NotFoundException
			);
		});
	});

	describe('delete', () => {
		const userId = 1;
		const catId = 'cat1';

		it('should delete a like successfully', async () => {
			jest.spyOn(likesRepository, 'exists').mockResolvedValue(true);
			jest
				.spyOn(likesRepository, 'delete')
				.mockResolvedValue({ affected: 1 } as any);

			await service.delete(userId, catId);

			expect(likesRepository.exists).toHaveBeenCalledWith({
				where: { user_id: userId, cat_id: catId }
			});
			expect(likesRepository.delete).toHaveBeenCalledWith({
				user_id: userId,
				cat_id: catId
			});
		});

		it('should throw NotFoundException if like not found', async () => {
			jest.spyOn(likesRepository, 'exists').mockResolvedValue(false);

			await expect(service.delete(userId, catId)).rejects.toThrow(
				NotFoundException
			);
			expect(likesRepository.exists).toHaveBeenCalledWith({
				where: { user_id: userId, cat_id: catId }
			});
		});

		it('should throw NotFoundException if delete affects no rows', async () => {
			jest.spyOn(likesRepository, 'exists').mockResolvedValue(true);
			jest
				.spyOn(likesRepository, 'delete')
				.mockResolvedValue({ affected: 0 } as any);

			await expect(service.delete(userId, catId)).rejects.toThrow(
				NotFoundException
			);
		});
	});
});
