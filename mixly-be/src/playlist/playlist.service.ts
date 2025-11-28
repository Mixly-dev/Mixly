import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Playlist, PlaylistVisibility, Track, PlaylistTrack, Like } from '../entities';
import { CreatePlaylistInput, UpdatePlaylistInput, TrackInput, PaginationInput, PlaylistConnection } from './dto/playlist.dto';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>,
    @InjectRepository(Track)
    private trackRepository: Repository<Track>,
    @InjectRepository(PlaylistTrack)
    private playlistTrackRepository: Repository<PlaylistTrack>,
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
  ) {}

  async create(userId: string, input: CreatePlaylistInput): Promise<Playlist> {
    const playlist = this.playlistRepository.create({
      ...input,
      ownerId: userId,
      visibility: input.visibility || PlaylistVisibility.PRIVATE,
    });
    return this.playlistRepository.save(playlist);
  }

  async update(playlistId: string, userId: string, input: UpdatePlaylistInput): Promise<Playlist> {
    const playlist = await this.findByIdOrFail(playlistId);
    if (playlist.ownerId !== userId) {
      throw new ForbiddenException('You can only update your own playlists');
    }
    Object.assign(playlist, input);
    return this.playlistRepository.save(playlist);
  }

  async delete(playlistId: string, userId: string): Promise<boolean> {
    const playlist = await this.findByIdOrFail(playlistId);
    if (playlist.ownerId !== userId) {
      throw new ForbiddenException('You can only delete your own playlists');
    }
    await this.playlistRepository.remove(playlist);
    return true;
  }

  async findById(playlistId: string, requesterId?: string): Promise<Playlist | null> {
    const playlist = await this.playlistRepository.findOne({
      where: { id: playlistId },
      relations: ['owner', 'playlistTracks', 'playlistTracks.track'],
    });
    if (!playlist) return null;
    if (playlist.visibility === PlaylistVisibility.PRIVATE && playlist.ownerId !== requesterId) {
      return null;
    }
    return this.enrichPlaylist(playlist, requesterId);
  }

  async findByIdOrFail(playlistId: string): Promise<Playlist> {
    const playlist = await this.playlistRepository.findOne({
      where: { id: playlistId },
      relations: ['owner', 'playlistTracks', 'playlistTracks.track'],
    });
    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }
    return playlist;
  }


  async findByUser(userId: string, pagination: PaginationInput, requesterId?: string): Promise<PlaylistConnection> {
    const { first = 20, after } = pagination;
    
    const queryBuilder = this.playlistRepository
      .createQueryBuilder('playlist')
      .leftJoinAndSelect('playlist.owner', 'owner')
      .where('playlist.ownerId = :userId', { userId });

    if (requesterId !== userId) {
      queryBuilder.andWhere('playlist.visibility = :visibility', { visibility: PlaylistVisibility.PUBLIC });
    }

    queryBuilder.orderBy('playlist.createdAt', 'DESC');

    if (after) {
      const cursor = Buffer.from(after, 'base64').toString('utf-8');
      queryBuilder.andWhere('playlist.createdAt < :cursor', { cursor });
    }

    const [playlists, totalCount] = await Promise.all([
      queryBuilder.take(first + 1).getMany(),
      queryBuilder.getCount(),
    ]);

    const hasNextPage = playlists.length > first;
    const edges = playlists.slice(0, first).map((playlist) => ({
      node: playlist,
      cursor: Buffer.from(playlist.createdAt.toISOString()).toString('base64'),
    }));

    return {
      edges,
      pageInfo: {
        hasNextPage,
        hasPreviousPage: !!after,
        startCursor: edges[0]?.cursor,
        endCursor: edges[edges.length - 1]?.cursor,
      },
      totalCount,
    };
  }

  async findByShareCode(shareCode: string, requesterId?: string): Promise<Playlist | null> {
    const playlist = await this.playlistRepository.findOne({
      where: { shareCode },
      relations: ['owner', 'playlistTracks', 'playlistTracks.track'],
    });
    if (!playlist) return null;
    return this.enrichPlaylist(playlist, requesterId);
  }

  async generateShareLink(playlistId: string, userId: string): Promise<string> {
    const playlist = await this.findByIdOrFail(playlistId);
    if (playlist.ownerId !== userId) {
      throw new ForbiddenException('You can only generate share links for your own playlists');
    }
    if (!playlist.shareCode) {
      playlist.shareCode = uuidv4().replace(/-/g, '').substring(0, 12);
      await this.playlistRepository.save(playlist);
    }
    return playlist.shareCode;
  }

  async addTrack(playlistId: string, userId: string, trackInput: TrackInput): Promise<Playlist> {
    const playlist = await this.findByIdOrFail(playlistId);
    if (playlist.ownerId !== userId) {
      throw new ForbiddenException('You can only add tracks to your own playlists');
    }

    const track = this.trackRepository.create(trackInput);
    await this.trackRepository.save(track);

    const maxPosition = await this.playlistTrackRepository
      .createQueryBuilder('pt')
      .where('pt.playlistId = :playlistId', { playlistId })
      .select('MAX(pt.position)', 'max')
      .getRawOne();

    const playlistTrack = this.playlistTrackRepository.create({
      playlistId,
      trackId: track.id,
      position: (maxPosition?.max || 0) + 1,
    });
    await this.playlistTrackRepository.save(playlistTrack);

    return this.findByIdOrFail(playlistId);
  }

  async removeTrack(playlistId: string, userId: string, trackId: string): Promise<Playlist> {
    const playlist = await this.findByIdOrFail(playlistId);
    if (playlist.ownerId !== userId) {
      throw new ForbiddenException('You can only remove tracks from your own playlists');
    }

    await this.playlistTrackRepository.delete({ playlistId, trackId });
    return this.findByIdOrFail(playlistId);
  }

  async reorderTracks(playlistId: string, userId: string, trackIds: string[]): Promise<Playlist> {
    const playlist = await this.findByIdOrFail(playlistId);
    if (playlist.ownerId !== userId) {
      throw new ForbiddenException('You can only reorder tracks in your own playlists');
    }

    for (let i = 0; i < trackIds.length; i++) {
      await this.playlistTrackRepository.update(
        { playlistId, trackId: trackIds[i] },
        { position: i + 1 },
      );
    }

    return this.findByIdOrFail(playlistId);
  }

  private async enrichPlaylist(playlist: Playlist, requesterId?: string): Promise<Playlist> {
    const trackCount = await this.playlistTrackRepository.count({ where: { playlistId: playlist.id } });
    const likeCount = await this.likeRepository.count({ where: { playlistId: playlist.id } });
    
    let isLiked = false;
    if (requesterId) {
      const like = await this.likeRepository.findOne({ where: { playlistId: playlist.id, userId: requesterId } });
      isLiked = !!like;
    }

    playlist.trackCount = trackCount;
    playlist.likeCount = likeCount;
    playlist.isLiked = isLiked;

    if (playlist.playlistTracks) {
      playlist.playlistTracks.sort((a, b) => a.position - b.position);
    }

    return playlist;
  }
}
