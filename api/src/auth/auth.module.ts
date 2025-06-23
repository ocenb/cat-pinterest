import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';

@Module({
	controllers: [AuthController],
	providers: [
		AuthService,
		{
			provide: APP_GUARD,
			useClass: AuthGuard
		}
	],
	imports: [
		UserModule,
		JwtModule.registerAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService): JwtModuleOptions => ({
				global: true,
				secret: configService.getOrThrow<string>('JWT_SECRET'),
				signOptions: {
					expiresIn: configService.getOrThrow<string>('JWT_EXPIRES_IN')
				}
			})
		})
	],
	exports: [JwtModule]
})
export class AuthModule {}
