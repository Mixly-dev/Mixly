import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SocialService } from './social.service';
import { GqlAuthGuard, CurrentUser } from '../auth';
import { User } from '../entities/user.entity';
import { UserConnection } from './dto/social.dto';
import { PlaylistConnection, PaginationInput } from '../playlist/dto/playlist.dto';

@Resolver()
export class SocialResolver {
  constructor(private socialService: SocialService) {}

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async follow(
    @CurrentUser() user: User,
    @Args('userId', { type: () => ID }) userId: string,
  ): Promise<boolean> {
    return this.socialService.follow(user.id, userId);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async unfollow(
    @CurrentUser() user: User,
    @Args('userId', { type: () => ID }) userId: string,
  ): Promise<boolean> {
    return this.socialService.unfollow(user.id, userId);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async likePlaylist(
    @CurrentUser() user: User,
    @Args('playlistId', { type: () => ID }) playlistId: string,
  ): Promise<boolean> {
    return this.socialService.likePlaylist(user.id, playlistId);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async unlikePlaylist(
    @CurrentUser() user: User,
    @Args('playlistId', { type: () => ID }) playlistId: string,
  ): Promise<boolean> {
    return this.socialService.unlikePlaylist(user.id, playlistId);
  }

  @Query(() => PlaylistConnection)
  @UseGuards(GqlAuthGuard)
  async feed(
    @CurrentUser() user: User,
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
  ): Promise<PlaylistConnection> {
    return this.socialService.getFeed(user.id, pagination || {});
  }
}
