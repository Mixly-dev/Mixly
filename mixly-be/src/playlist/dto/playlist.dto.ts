import { InputType, Field, ObjectType, Int, ID } from '@nestjs/graphql';
import { IsString, IsOptional, IsEnum, MaxLength, Min } from 'class-validator';
import { PlaylistVisibility, Playlist } from '../../entities/playlist.entity';

@InputType()
export class CreatePlaylistInput {
  @Field()
  @IsString()
  @MaxLength(100)
  title: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @Field(() => PlaylistVisibility, { nullable: true })
  @IsOptional()
  @IsEnum(PlaylistVisibility)
  visibility?: PlaylistVisibility;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  genre?: string;
}

@InputType()
export class UpdatePlaylistInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  coverImageUrl?: string;

  @Field(() => PlaylistVisibility, { nullable: true })
  @IsOptional()
  @IsEnum(PlaylistVisibility)
  visibility?: PlaylistVisibility;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  genre?: string;
}

@InputType()
export class TrackInput {
  @Field()
  @IsString()
  title: string;

  @Field()
  @IsString()
  artist: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  album?: string;

  @Field(() => Int)
  @Min(1)
  duration: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  coverImageUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  externalUrl?: string;
}

@InputType()
export class PaginationInput {
  @Field(() => Int, { nullable: true, defaultValue: 20 })
  @IsOptional()
  first?: number;

  @Field({ nullable: true })
  @IsOptional()
  after?: string;
}

@ObjectType()
export class PageInfo {
  @Field()
  hasNextPage: boolean;

  @Field()
  hasPreviousPage: boolean;

  @Field({ nullable: true })
  startCursor?: string;

  @Field({ nullable: true })
  endCursor?: string;
}

@ObjectType()
export class PlaylistEdge {
  @Field(() => Playlist)
  node: Playlist;

  @Field()
  cursor: string;
}

@ObjectType()
export class PlaylistConnection {
  @Field(() => [PlaylistEdge])
  edges: PlaylistEdge[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;

  @Field(() => Int)
  totalCount: number;
}
