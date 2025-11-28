import { InputType, Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { PlaylistConnection } from '../../playlist/dto/playlist.dto';
import { UserConnection } from '../../social/dto/social.dto';

export enum TimeRange {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  ALL_TIME = 'ALL_TIME',
}

registerEnumType(TimeRange, {
  name: 'TimeRange',
});

@InputType()
export class SearchFilters {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  genre?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  category?: string;
}

@ObjectType()
export class SearchResult {
  @Field(() => PlaylistConnection)
  playlists: PlaylistConnection;

  @Field(() => UserConnection)
  users: UserConnection;
}
