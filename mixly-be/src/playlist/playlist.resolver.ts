import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { Playlist, Track } from '../entities';
import { GqlAuthGuard, CurrentUser } from '../auth';
import { User } from '../entities/user.entity';
import {
  CreatePlaylistInput,
  UpdatePlaylistInput,
  TrackInput,
  PaginationInput,
  PlaylistConnection,
} from './dto/playlist.dto';

@Resolver(() => Playlist)
export class PlaylistResolver {
  constructor(private playlistService: PlaylistService) {}

  @Query(() => Playlist, { nullable: true })
  async playlist(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user?: User,
  ): Promise<Playlist | null> {
    return this.playlistService.findById(id, user?.id);
  }

  @Query(() => Playlist, { nullable: true })
  async playlistByShareCode(
    @Args('shareCode') shareCode: string,
    @CurrentUser() user?: User,
  ): Promise<Playlist | null> {
    return this.playlistService.findByShareCode(shareCode, user?.id);
  }

  @Query(() => PlaylistConnection)
  @UseGuards(GqlAuthGuard)
  async myPlaylists(
    @CurrentUser() user: User,
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
  ): Promise<PlaylistConnection> {
    return this.playlistService.findByUser(user.id, pagination || {}, user.id);
  }

  @Mutation(() => Playlist)
  @UseGuards(GqlAuthGuard)
  async createPlaylist(
    @CurrentUser() user: User,
    @Args('input') input: CreatePlaylistInput,
  ): Promise<Playlist> {
    return this.playlistService.create(user.id, input);
  }

  @Mutation(() => Playlist)
  @UseGuards(GqlAuthGuard)
  async updatePlaylist(
    @CurrentUser() user: User,
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdatePlaylistInput,
  ): Promise<Playlist> {
    return this.playlistService.update(id, user.id, input);
  }


  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deletePlaylist(
    @CurrentUser() user: User,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.playlistService.delete(id, user.id);
  }

  @Mutation(() => Playlist)
  @UseGuards(GqlAuthGuard)
  async addTrackToPlaylist(
    @CurrentUser() user: User,
    @Args('playlistId', { type: () => ID }) playlistId: string,
    @Args('track') track: TrackInput,
  ): Promise<Playlist> {
    return this.playlistService.addTrack(playlistId, user.id, track);
  }

  @Mutation(() => Playlist)
  @UseGuards(GqlAuthGuard)
  async removeTrackFromPlaylist(
    @CurrentUser() user: User,
    @Args('playlistId', { type: () => ID }) playlistId: string,
    @Args('trackId', { type: () => ID }) trackId: string,
  ): Promise<Playlist> {
    return this.playlistService.removeTrack(playlistId, user.id, trackId);
  }

  @Mutation(() => Playlist)
  @UseGuards(GqlAuthGuard)
  async reorderPlaylistTracks(
    @CurrentUser() user: User,
    @Args('playlistId', { type: () => ID }) playlistId: string,
    @Args('trackIds', { type: () => [ID] }) trackIds: string[],
  ): Promise<Playlist> {
    return this.playlistService.reorderTracks(playlistId, user.id, trackIds);
  }

  @Mutation(() => String)
  @UseGuards(GqlAuthGuard)
  async generatePlaylistShareLink(
    @CurrentUser() user: User,
    @Args('playlistId', { type: () => ID }) playlistId: string,
  ): Promise<string> {
    return this.playlistService.generateShareLink(playlistId, user.id);
  }

  @ResolveField(() => [Track])
  tracks(@Parent() playlist: Playlist): Track[] {
    if (!playlist.playlistTracks) return [];
    return playlist.playlistTracks
      .sort((a, b) => a.position - b.position)
      .map((pt, index) => ({
        ...pt.track,
        position: index + 1,
      }));
  }
}
