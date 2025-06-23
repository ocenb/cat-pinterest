import { Test, TestingModule } from '@nestjs/testing';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { Likes } from './likes.entity';

describe('LikesController', () => {
	let controller: LikesController;
	let service: LikesService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [LikesController],
			providers: [
				{
					provide: LikesService,
					useValue: {
						getAll: jest.fn(),
						add: jest.fn(),
						delete: jest.fn()
					}
				}
			]
		}).compile();

		controller = module.get(LikesController);
		service = module.get(LikesService);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	describe('getAll', () => {
		it('should return all likes for a user', async () => {
			const userId = 1;
			const mockLikes: { data: Likes[] } = {
				data: [
					{
						cat_id: 'cat1',
						created_at: new Date(),
						user_id: userId,
						user: {} as any
					}
				]
			};
			jest.spyOn(service, 'getAll').mockResolvedValue(mockLikes);

			const result = await controller.getAll(userId);

			expect(service.getAll).toHaveBeenCalledWith(userId);
			expect(result).toEqual(mockLikes);
		});
	});

	describe('add', () => {
		it('should add a like', async () => {
			const userId = 1;
			const addLikeDto = { cat_id: 'cat1' };
			jest.spyOn(service, 'add').mockResolvedValue(undefined);

			await controller.add(userId, addLikeDto);

			expect(service.add).toHaveBeenCalledWith(userId, addLikeDto.cat_id);
		});
	});

	describe('delete', () => {
		it('should delete a like', async () => {
			const userId = 1;
			const catId = 'cat1';
			jest.spyOn(service, 'delete').mockResolvedValue(undefined);

			await controller.delete(userId, catId);

			expect(service.delete).toHaveBeenCalledWith(userId, catId);
		});
	});
});
