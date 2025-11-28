import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistService } from './playlist.service';
import { PlaylistResolver } from './playlist.resolver';
import { Playlist, Track, PlaylistTrack, Like } from '../entities';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Playlist, Track, PlaylistTrack, Like]),
    AuthModule,
  ],
  providers: [PlaylistService, PlaylistResolver],
  exports: [PlaylistService],
})
export class PlaylistModule {}
