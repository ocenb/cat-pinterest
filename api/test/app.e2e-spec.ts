import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Likes } from 'src/likes/likes.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { AppModule } from 'src/app.module';
import { LoginDto } from 'src/auth/auth.dto';
import { AddLikeDto } from 'src/likes/likes.dto';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('App (e2e)', () => {
	let app: INestApplication;
	let authenticatedRequest: request.Agent;
	let userCredentials: LoginDto;
	let userId: number;
	jest.setTimeout(30000);

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [
				AppModule,
				TypeOrmModule.forRootAsync({
					inject: [ConfigService],
					useFactory: (configService: ConfigService) => ({
						type: 'postgres',
						host: configService.getOrThrow<string>('POSTGRES_HOST'),
						port: parseInt(configService.getOrThrow('POSTGRES_PORT')),
						username: configService.getOrThrow<string>('POSTGRES_USER'),
						password: configService.getOrThrow<string>('POSTGRES_PASSWORD'),
						database: configService.getOrThrow<string>('POSTGRES_DB'),
						entities: [User, Likes],
						logging: false
					})
				}),
				JwtModule.registerAsync({
					inject: [ConfigService],
					useFactory: (configService: ConfigService): JwtModuleOptions => ({
						secret: configService.getOrThrow<string>('JWT_SECRET'),
						signOptions: {
							expiresIn: configService.getOrThrow<string>('JWT_EXPIRES_IN')
						}
					})
				})
			],
			providers: [
				{
					provide: APP_GUARD,
					useExisting: AuthGuard
				},
				AuthGuard
			]
		}).compile();

		app = moduleRef.createNestApplication();
		await app.init();

		userCredentials = {
			login: 'e2euser',
			password: 'e2epassword'
		};

		const response = await request(app.getHttpServer())
			.post('/user')
			.send(userCredentials)
			.expect(201);

		expect(response.headers['x-auth-token']).toBeDefined();
		expect(typeof response.headers['x-auth-token']).toBe('string');
		expect(response.headers['x-auth-token'].length).toBeGreaterThan(0);
		expect(response.body.id).toBeDefined();
		expect(response.body.login).toEqual(userCredentials.login);

		const authToken = response.headers['x-auth-token'];
		authenticatedRequest = request
			.agent(app.getHttpServer())
			.set('Authorization', `Bearer ${authToken}`);
		userId = response.body.id;
	});

	afterAll(async () => {
		await app.close();
	});

	describe('Auth Module', () => {
		it('/user (POST) - should login an existing user', async () => {
			const response = await request(app.getHttpServer())
				.post('/user')
				.send(userCredentials)
				.expect(201);

			expect(response.headers['x-auth-token']).toBeDefined();
			expect(typeof response.headers['x-auth-token']).toBe('string');
			expect(response.headers['x-auth-token'].length).toBeGreaterThan(0);
			expect(response.body).toEqual({
				id: userId,
				login: userCredentials.login
			});
		});

		it('/user (POST) - should return 401 for wrong password', async () => {
			const wrongPasswordDto: LoginDto = {
				...userCredentials,
				password: 'wrongpassword'
			};
			await request(app.getHttpServer())
				.post('/user')
				.send(wrongPasswordDto)
				.expect(401);
		});
	});

	describe('Likes Module', () => {
		let likeInfo: Likes;
		it('/likes (POST) - should add a like', async () => {
			const addLikeDto: AddLikeDto = {
				cat_id: 'ebv'
			};
			const response = await authenticatedRequest
				.post('/likes')
				.send(addLikeDto)
				.expect(201);

			likeInfo = response.body;
			expect(likeInfo).toBeDefined();

			expect(likeInfo).toHaveProperty('cat_id');
			expect(typeof likeInfo.cat_id).toBe('string');
			expect(likeInfo.cat_id).toBe(addLikeDto.cat_id);

			expect(likeInfo).toHaveProperty('created_at');
			expect(typeof likeInfo.created_at).toBe('string');
		});

		it('/likes (GET) - should return all likes for a user', async () => {
			const response = await authenticatedRequest.get('/likes').expect(200);

			expect(response.body).toEqual({ data: [likeInfo] });
		});

		it('/likes/:cat_id (DELETE) - should delete a like', async () => {
			await authenticatedRequest
				.delete(`/likes/${likeInfo.cat_id}`)
				.expect(200);
		});

		it('/likes (GET) - should return empty list of likes', async () => {
			const response = await authenticatedRequest.get('/likes').expect(200);

			expect(response.body.data).toHaveLength(0);
		});

		it('/likes/:cat_id (DELETE) - should return 404 if like not found', async () => {
			await authenticatedRequest
				.delete(`/likes/${likeInfo.cat_id}`)
				.expect(404);
		});
	});
});
