"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../entities");
let SocialService = class SocialService {
    constructor(followRepository, likeRepository, playlistRepository, userRepository) {
        this.followRepository = followRepository;
        this.likeRepository = likeRepository;
        this.playlistRepository = playlistRepository;
        this.userRepository = userRepository;
    }
    async follow(followerId, followeeId) {
        if (followerId === followeeId) {
            throw new common_1.BadRequestException('You cannot follow yourself');
        }
        const existingFollow = await this.followRepository.findOne({
            where: { followerId, followeeId },
        });
        if (existingFollow) {
            throw new common_1.ConflictException('Already following this user');
        }
        const followee = await this.userRepository.findOne({ where: { id: followeeId } });
        if (!followee) {
            throw new common_1.NotFoundException('User not found');
        }
        const follow = this.followRepository.create({ followerId, followeeId });
        await this.followRepository.save(follow);
        return true;
    }
    async unfollow(followerId, followeeId) {
        const follow = await this.followRepository.findOne({
            where: { followerId, followeeId },
        });
        if (!follow) {
            throw new common_1.BadRequestException('Not following this user');
        }
        await this.followRepository.remove(follow);
        return true;
    }
    async likePlaylist(userId, playlistId) {
        const existingLike = await this.likeRepository.findOne({
            where: { userId, playlistId },
        });
        if (existingLike) {
            throw new common_1.ConflictException('Already liked this playlist');
        }
        const playlist = await this.playlistRepository.findOne({ where: { id: playlistId } });
        if (!playlist) {
            throw new common_1.NotFoundException('Playlist not found');
        }
        const like = this.likeRepository.create({ userId, playlistId });
        await this.likeRepository.save(like);
        return true;
    }
    async unlikePlaylist(userId, playlistId) {
        const like = await this.likeRepository.findOne({
            where: { userId, playlistId },
        });
        if (!like) {
            throw new common_1.BadRequestException('Not liked this playlist');
        }
        await this.likeRepository.remove(like);
        return true;
    }
    async getFollowers(userId, pagination) {
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
    async getFollowing(userId, pagination) {
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
    async getFeed(userId, pagination) {
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
            .andWhere('playlist.visibility = :visibility', { visibility: entities_1.PlaylistVisibility.PUBLIC })
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
    async isFollowing(followerId, followeeId) {
        const follow = await this.followRepository.findOne({
            where: { followerId, followeeId },
        });
        return !!follow;
    }
};
exports.SocialService = SocialService;
exports.SocialService = SocialService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Follow)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.Like)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.Playlist)),
    __param(3, (0, typeorm_1.InjectRepository)(entities_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SocialService);
//# sourceMappingURL=social.service.js.map