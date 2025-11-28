import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialService } from './social.service';
import { SocialResolver } from './social.resolver';
import { Follow, Like, Playlist, User } from '../entities';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Follow, Like, Playlist, User]),
    AuthModule,
  ],
  providers: [SocialService, SocialResolver],
  exports: [SocialService],
})
export class SocialModule {}
