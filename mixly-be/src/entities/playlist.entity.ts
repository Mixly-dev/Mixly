import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, ID, Int, registerEnumType } from '@nestjs/graphql';
import { User } from './user.entity';
import { PlaylistTrack } from './playlist-track.entity';

export enum PlaylistVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

registerEnumType(PlaylistVisibility, {
  name: 'PlaylistVisibility',
});

@ObjectType()
@Entity('playlists')
export class Playlist {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  title: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  coverImageUrl: string;

  @Field(() => PlaylistVisibility)
  @Column({ type: 'enum', enum: PlaylistVisibility, default: PlaylistVisibility.PRIVATE })
  visibility: PlaylistVisibility;

  @Field({ nullable: true })
  @Column({ unique: true, nullable: true })
  shareCode: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  genre: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.playlists)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column()
  ownerId: string;

  @OneToMany(() => PlaylistTrack, (pt) => pt.playlist, { cascade: true })
  playlistTracks: PlaylistTrack[];

  @Field(() => Int)
  trackCount: number;

  @Field(() => Int)
  likeCount: number;

  @Field()
  isLiked: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
