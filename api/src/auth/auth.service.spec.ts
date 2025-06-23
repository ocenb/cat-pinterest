import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, Logger } from '@nestjs/common';
import { LoginDto } from './auth.dto';
import { compare, hash } from 'bcrypt';

jest.mock('bcrypt', () => ({
	compare: jest.fn(),
	hash: jest.fn()
}));

describe('AuthService', () => {
	let service: AuthService;
	let userService: UserService;
	let jwtService: JwtService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: UserService,
					useValue: {
						getByLogin: jest.fn(),
						create: jest.fn()
					}
				},
				{
					provide: JwtService,
					useValue: {
						sign: jest.fn()
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

		service = module.get(AuthService);
		userService = module.get(UserService);
		jwtService = module.get(JwtService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('login', () => {
		const loginDto: LoginDto = { login: 'testuser', password: 'password' };
		const hashedPassword = 'hashedpassword';
		const mockUser = { id: 1, login: 'testuser', password: hashedPassword };
		const mockToken = 'mocktoken';

		beforeEach(() => {
			(hash as jest.Mock).mockResolvedValue(hashedPassword);
			(jwtService.sign as jest.Mock).mockReturnValue(mockToken);
		});

		it('should log in an existing user with correct password', async () => {
			(userService.getByLogin as jest.Mock).mockResolvedValue(mockUser);
			(compare as jest.Mock).mockResolvedValue(true);

			const result = await service.login(loginDto);

			expect(userService.getByLogin).toHaveBeenCalledWith(loginDto.login);
			expect(compare).toHaveBeenCalledWith(
				loginDto.password,
				mockUser.password
			);
			expect(jwtService.sign).toHaveBeenCalledWith(
				{ userId: mockUser.id },
				{ expiresIn: '10d' }
			);
			expect(result).toEqual({
				user: { login: mockUser.login, id: mockUser.id },
				token: mockToken
			});
		});

		it('should throw UnauthorizedException for wrong password', async () => {
			(userService.getByLogin as jest.Mock).mockResolvedValue(mockUser);
			(compare as jest.Mock).mockResolvedValue(false);

			await expect(service.login(loginDto)).rejects.toThrow(
				UnauthorizedException
			);
			expect(compare).toHaveBeenCalledWith(
				loginDto.password,
				mockUser.password
			);
		});

		it('should create a new user if not found', async () => {
			(userService.getByLogin as jest.Mock).mockResolvedValue(null);
			(userService.create as jest.Mock).mockResolvedValue(mockUser);

			const result = await service.login(loginDto);

			expect(userService.getByLogin).toHaveBeenCalledWith(loginDto.login);
			expect(hash).toHaveBeenCalledWith(loginDto.password, 10);
			expect(userService.create).toHaveBeenCalledWith(
				loginDto.login,
				hashedPassword
			);
			expect(jwtService.sign).toHaveBeenCalledWith(
				{ userId: mockUser.id },
				{ expiresIn: '10d' }
			);
			expect(result).toEqual({
				user: { login: mockUser.login, id: mockUser.id },
				token: mockToken
			});
		});
	});
});
