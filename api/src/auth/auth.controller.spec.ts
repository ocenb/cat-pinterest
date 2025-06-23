import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Response } from 'express';

describe('AuthController', () => {
	let controller: AuthController;
	let service: AuthService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [
				{
					provide: AuthService,
					useValue: {
						login: jest.fn()
					}
				}
			]
		}).compile();

		controller = module.get(AuthController);
		service = module.get(AuthService);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	describe('login', () => {
		it('should return user and set token', async () => {
			const mockLoginDto = { login: 'testuser', password: 'password' };
			const mockUser = { id: 1, login: 'testuser' };
			const mockToken = 'mock-token';
			const mockResponse = {
				set: jest.fn(),
				json: jest.fn()
			} as unknown as Response;

			jest
				.spyOn(service, 'login')
				.mockResolvedValue({ user: mockUser, token: mockToken });

			const result = await controller.login(mockLoginDto, mockResponse);

			expect(service.login).toHaveBeenCalledWith(mockLoginDto);
			expect(mockResponse.set).toHaveBeenCalledWith('X-Auth-Token', mockToken);
			expect(result).toEqual(mockUser);
		});
	});
});
