import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { LikesModule } from './likes/likes.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
		}),
		ThrottlerModule.forRoot([
			{
				ttl: 60000,
				limit: 100
			}
		]),
		TypeOrmModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				type: 'postgres',
				host: configService.getOrThrow<string>('POSTGRES_HOST'),
				port: parseInt(configService.getOrThrow('POSTGRES_PORT')),
				username: configService.getOrThrow<string>('POSTGRES_USER'),
				password: configService.getOrThrow<string>('POSTGRES_PASSWORD'),
				database: configService.getOrThrow<string>('POSTGRES_DB'),
				autoLoadEntities: true,
				synchronize: true
			})
		}),
		AuthModule,
		LikesModule
	]
})
export class AppModule {}
