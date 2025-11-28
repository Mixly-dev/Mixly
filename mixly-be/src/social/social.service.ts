import { Injectable, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow, Like, Playlist, User, PlaylistVisibility } from '../entities';
import { UserConnection } from './dto/social.dto';
import { PlaylistConnection, PaginationInput } from '../playlist/dto/playlist.dto';

@Injectable()
export class SocialService {
  constructor(
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async follow(followerId: string, followeeId: string): Promise<boolean> {
    if (followerId === followeeId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const existingFollow = await this.followRepository.findOne({
      where: { followerId, followeeId },
    });

    if (existingFollow) {
      throw new ConflictException('Already following this user');
    }

    const followee = await this.userRepository.findOne({ where: { id: followeeId } });
    if (!followee) {
      throw new NotFoundException('User not found');
    }

    const follow = this.followRepository.create({ followerId, followeeId });
    await this.followRepository.save(follow);
    return true;
  }

  async unfollow(followerId: string, followeeId: string): Promise<boolean> {
    const follow = await this.followRepository.findOne({
      where: { followerId, followeeId },
    });

    if (!follow) {
      throw new BadRequestException('Not following this user');
    }

    await this.followRepository.remove(follow);
    return true;
  }

  async likePlaylist(userId: string, playlistId: string): Promise<boolean> {
    const existingLike = await this.likeRepository.findOne({
      where: { userId, playlistId },
    });

    if (existingLike) {
      throw new ConflictException('Already liked this playlist');
    }

    const playlist = await this.playlistRepository.findOne({ where: { id: playlistId } });
    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    const like = this.likeRepository.create({ userId, playlistId });
    await this.likeRepository.save(like);
    return true;
  }

  async unlikePlaylist(userId: string, playlistId: string): Promise<boolean> {
    const like = await this.likeRepository.findOne({
      where: { userId, playlistId },
    });

    if (!like) {
      throw new BadRequestException('Not liked this playlist');
    }

    await this.likeRepository.remove(like);
    return true;
  }


  async getFollowers(userId: string, pagination: PaginationInput): Promise<UserConnection> {
    const { first = 20, after } = pagination;

    const queryBuilder = this.followRepository
      .createQueryBuilder('follow')
      .leftJoinAndSelect('follow.follower', 'follower')
      .where('follow.followeeId = :userId', { userId })
      .orderBy('follow.createdAt', 'DESC');

    if (after) {
      const cursor = Buffer.from(after, 'base64').toString('utf-8');
      queryBuilder.andWhere('follow.createdAt < :cursor', { cursor });
    }

    const [follows, totalCount] = await Promise.all([
      queryBuilder.take(first + 1).getMany(),
      queryBuilder.getCount(),
    ]);

    const hasNextPage = follows.length > first;
    const edges = follows.slice(0, first).map((follow) => ({
      node: follow.follower,
      cursor: Buffer.from(follow.createdAt.toISOString()).toString('base64'),
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

  async getFollowing(userId: string, pagination: PaginationInput): Promise<UserConnection> {
    const { first = 20, after } = pagination;

    const queryBuilder = this.followRepository
      .createQueryBuilder('follow')
      .leftJoinAndSelect('follow.followee', 'followee')
      .where('follow.followerId = :userId', { userId })
      .orderBy('follow.createdAt', 'DESC');

    if (after) {
      const cursor = Buffer.from(after, 'base64').toString('utf-8');
      queryBuilder.andWhere('follow.createdAt < :cursor', { cursor });
    }

    const [follows, totalCount] = await Promise.all([
      queryBuilder.take(first + 1).getMany(),
      queryBuilder.getCount(),
    ]);

    const hasNextPage = follows.length > first;
    const edges = follows.slice(0, first).map((follow) => ({
      node: follow.followee,
      cursor: Buffer.from(follow.createdAt.toISOString()).toString('base64'),
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

  async getFeed(userId: string, pagination: PaginationInput): Promise<PlaylistConnection> {
    const { first = 20, after } = pagination;

    const followingIds = await this.followRepository
      .createQueryBuilder('follow')
      .select('follow.followeeId')
      .where('follow.followerId = :userId', { userId })
      .getRawMany();

    const followeeIds = followingIds.map((f) => f.follow_followeeId);

    if (followeeIds.length === 0) {
      return {
        edges: [],
        pageInfo: { hasNextPage: false, hasPreviousPage: false },
        totalCount: 0,
      };
    }

    const queryBuilder = this.playlistRepository
      .createQueryBuilder('playlist')
      .leftJoinAndSelect('playlist.owner', 'owner')
      .where('playlist.ownerId IN (:...followeeIds)', { followeeIds })
      .andWhere('playlist.visibility = :visibility', { visibility: PlaylistVisibility.PUBLIC })
      .orderBy('playlist.createdAt', 'DESC');

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

  async isFollowing(followerId: string, followeeId: string): Promise<boolean> {
    const follow = await this.followRepository.findOne({
      where: { followerId, followeeId },
    });
    return !!follow;
  }
}
