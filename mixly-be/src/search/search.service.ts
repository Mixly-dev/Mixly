import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Playlist, User, Like, PlaylistVisibility } from '../entities';
import { SearchFilters, SearchResult, TimeRange } from './dto/search.dto';
import { PlaylistConnection, PaginationInput } from '../playlist/dto/playlist.dto';
import { UserConnection } from '../social/dto/social.dto';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
  ) {}

  async search(
    query: string,
    filters: SearchFilters,
    pagination: PaginationInput,
  ): Promise<SearchResult> {
    const [playlists, users] = await Promise.all([
      this.searchPlaylists(query, filters, pagination),
      this.searchUsers(query, pagination),
    ]);

    return { playlists, users };
  }

  private async searchPlaylists(
    query: string,
    filters: SearchFilters,
    pagination: PaginationInput,
  ): Promise<PlaylistConnection> {
    const { first = 20, after } = pagination;
    const searchTerm = `%${query.toLowerCase()}%`;

    const queryBuilder = this.playlistRepository
      .createQueryBuilder('playlist')
      .leftJoinAndSelect('playlist.owner', 'owner')
      .where('playlist.visibility = :visibility', { visibility: PlaylistVisibility.PUBLIC })
      .andWhere(
        '(LOWER(playlist.title) LIKE :searchTerm OR LOWER(playlist.description) LIKE :searchTerm)',
        { searchTerm },
      );

    if (filters?.genre) {
      queryBuilder.andWhere('LOWER(playlist.genre) = :genre', { genre: filters.genre.toLowerCase() });
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


  private async searchUsers(query: string, pagination: PaginationInput): Promise<UserConnection> {
    const { first = 20, after } = pagination;
    const searchTerm = `%${query.toLowerCase()}%`;

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .where(
        '(LOWER(user.username) LIKE :searchTerm OR LOWER(user.displayName) LIKE :searchTerm)',
        { searchTerm },
      )
      .orderBy('user.createdAt', 'DESC');

    if (after) {
      const cursor = Buffer.from(after, 'base64').toString('utf-8');
      queryBuilder.andWhere('user.createdAt < :cursor', { cursor });
    }

    const [users, totalCount] = await Promise.all([
      queryBuilder.take(first + 1).getMany(),
      queryBuilder.getCount(),
    ]);

    const hasNextPage = users.length > first;
    const edges = users.slice(0, first).map((user) => ({
      node: user,
      cursor: Buffer.from(user.createdAt.toISOString()).toString('base64'),
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

  async getTrending(timeRange: TimeRange, pagination: PaginationInput): Promise<PlaylistConnection> {
    const { first = 20, after } = pagination;

    let dateFilter: Date | null = null;
    const now = new Date();

    switch (timeRange) {
      case TimeRange.DAY:
        dateFilter = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case TimeRange.WEEK:
        dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case TimeRange.MONTH:
        dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case TimeRange.ALL_TIME:
      default:
        dateFilter = null;
    }

    const queryBuilder = this.playlistRepository
      .createQueryBuilder('playlist')
      .leftJoinAndSelect('playlist.owner', 'owner')
      .leftJoin('likes', 'like', 'like.playlistId = playlist.id')
      .where('playlist.visibility = :visibility', { visibility: PlaylistVisibility.PUBLIC })
      .groupBy('playlist.id')
      .addGroupBy('owner.id')
      .orderBy('COUNT(like.id)', 'DESC')
      .addOrderBy('playlist.createdAt', 'DESC');

    if (dateFilter) {
      queryBuilder.andWhere('playlist.createdAt > :dateFilter', { dateFilter });
    }

    const playlists = await queryBuilder.take(first + 1).getMany();
    const totalCount = await this.playlistRepository.count({
      where: { visibility: PlaylistVisibility.PUBLIC },
    });

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
}
