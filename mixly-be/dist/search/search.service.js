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
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../entities");
const search_dto_1 = require("./dto/search.dto");
let SearchService = class SearchService {
    constructor(playlistRepository, userRepository, likeRepository) {
        this.playlistRepository = playlistRepository;
        this.userRepository = userRepository;
        this.likeRepository = likeRepository;
    }
    async search(query, filters, pagination) {
        const [playlists, users] = await Promise.all([
            this.searchPlaylists(query, filters, pagination),
            this.searchUsers(query, pagination),
        ]);
        return { playlists, users };
    }
    async searchPlaylists(query, filters, pagination) {
        const { first = 20, after } = pagination;
        const searchTerm = `%${query.toLowerCase()}%`;
        const queryBuilder = this.playlistRepository
            .createQueryBuilder('playlist')
            .leftJoinAndSelect('playlist.owner', 'owner')
            .where('playlist.visibility = :visibility', { visibility: entities_1.PlaylistVisibility.PUBLIC })
            .andWhere('(LOWER(playlist.title) LIKE :searchTerm OR LOWER(playlist.description) LIKE :searchTerm)', { searchTerm });
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
    async searchUsers(query, pagination) {
        const { first = 20, after } = pagination;
        const searchTerm = `%${query.toLowerCase()}%`;
        const queryBuilder = this.userRepository
            .createQueryBuilder('user')
            .where('(LOWER(user.username) LIKE :searchTerm OR LOWER(user.displayName) LIKE :searchTerm)', { searchTerm })
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
    async getTrending(timeRange, pagination) {
        const { first = 20, after } = pagination;
        let dateFilter = null;
        const now = new Date();
        switch (timeRange) {
            case search_dto_1.TimeRange.DAY:
                dateFilter = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                break;
            case search_dto_1.TimeRange.WEEK:
                dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case search_dto_1.TimeRange.MONTH:
                dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case search_dto_1.TimeRange.ALL_TIME:
            default:
                dateFilter = null;
        }
        const queryBuilder = this.playlistRepository
            .createQueryBuilder('playlist')
            .leftJoinAndSelect('playlist.owner', 'owner')
            .leftJoin('likes', 'like', 'like.playlistId = playlist.id')
            .where('playlist.visibility = :visibility', { visibility: entities_1.PlaylistVisibility.PUBLIC })
            .groupBy('playlist.id')
            .addGroupBy('owner.id')
            .orderBy('COUNT(like.id)', 'DESC')
            .addOrderBy('playlist.createdAt', 'DESC');
        if (dateFilter) {
            queryBuilder.andWhere('playlist.createdAt > :dateFilter', { dateFilter });
        }
        const playlists = await queryBuilder.take(first + 1).getMany();
        const totalCount = await this.playlistRepository.count({
            where: { visibility: entities_1.PlaylistVisibility.PUBLIC },
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
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Playlist)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.Like)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SearchService);
//# sourceMappingURL=search.service.js.map