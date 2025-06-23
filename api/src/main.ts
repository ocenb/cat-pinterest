import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { load as loadYaml } from 'js-yaml';
import { readFileSync } from 'fs';
import { join } from 'path';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const configService = app.get(ConfigService);
	const port = configService.getOrThrow<string>('PORT');

	app.setGlobalPrefix('api');
	app.use(helmet({ crossOriginResourcePolicy: { policy: 'same-site' } }));
	app.useGlobalPipes(
		new ValidationPipe({
			forbidNonWhitelisted: true,
			whitelist: true,
			transform: true
		})
	);
	app.enableCors();

	const openApiFilePath = join(__dirname, '..', 'openapi.yaml');
	const openApiFileContent = readFileSync(openApiFilePath, 'utf8');
	const document = loadYaml(openApiFileContent);

	SwaggerModule.setup('api/docs', app, document as any);

	await app.listen(port, () => console.log(`Port: ${port}`));
}

bootstrap();
