import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Playlist } from './playlist.entity';
import { Track } from './track.entity';

@Entity('playlist_tracks')
export class PlaylistTrack {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Playlist, (playlist) => playlist.playlistTracks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'playlistId' })
  playlist: Playlist;

  @Column()
  playlistId: string;

  @ManyToOne(() => Track, { eager: true })
  @JoinColumn({ name: 'trackId' })
  track: Track;

  @Column()
  trackId: string;

  @Column()
  position: number;
}
