import { Module } from '@nestjs/common';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Likes } from './likes.entity';

@Module({
	controllers: [LikesController],
	providers: [LikesService],
	imports: [TypeOrmModule.forFeature([Likes])]
})
export class LikesModule {}
