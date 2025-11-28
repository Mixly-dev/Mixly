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
exports.PlaylistService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const uuid_1 = require("uuid");
const entities_1 = require("../entities");
let PlaylistService = class PlaylistService {
    constructor(playlistRepository, trackRepository, playlistTrackRepository, likeRepository) {
        this.playlistRepository = playlistRepository;
        this.trackRepository = trackRepository;
        this.playlistTrackRepository = playlistTrackRepository;
        this.likeRepository = likeRepository;
    }
    async create(userId, input) {
        const playlist = this.playlistRepository.create({
            ...input,
            ownerId: userId,
            visibility: input.visibility || entities_1.PlaylistVisibility.PRIVATE,
        });
        return this.playlistRepository.save(playlist);
    }
    async update(playlistId, userId, input) {
        const playlist = await this.findByIdOrFail(playlistId);
        if (playlist.ownerId !== userId) {
            throw new common_1.ForbiddenException('You can only update your own playlists');
        }
        Object.assign(playlist, input);
        return this.playlistRepository.save(playlist);
    }
    async delete(playlistId, userId) {
        const playlist = await this.findByIdOrFail(playlistId);
        if (playlist.ownerId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own playlists');
        }
        await this.playlistRepository.remove(playlist);
        return true;
    }
    async findById(playlistId, requesterId) {
        const playlist = await this.playlistRepository.findOne({
            where: { id: playlistId },
            relations: ['owner', 'playlistTracks', 'playlistTracks.track'],
        });
        if (!playlist)
            return null;
        if (playlist.visibility === entities_1.PlaylistVisibility.PRIVATE && playlist.ownerId !== requesterId) {
            return null;
        }
        return this.enrichPlaylist(playlist, requesterId);
    }
    async findByIdOrFail(playlistId) {
        const playlist = await this.playlistRepository.findOne({
            where: { id: playlistId },
            relations: ['owner', 'playlistTracks', 'playlistTracks.track'],
        });
        if (!playlist) {
            throw new common_1.NotFoundException('Playlist not found');
        }
        return playlist;
    }
    async findByUser(userId, pagination, requesterId) {
        const { first = 20, after } = pagination;
        const queryBuilder = this.playlistRepository
            .createQueryBuilder('playlist')
            .leftJoinAndSelect('playlist.owner', 'owner')
            .where('playlist.ownerId = :userId', { userId });
        if (requesterId !== userId) {
            queryBuilder.andWhere('playlist.visibility = :visibility', { visibility: entities_1.PlaylistVisibility.PUBLIC });
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
    async findByShareCode(shareCode, requesterId) {
        const playlist = await this.playlistRepository.findOne({
            where: { shareCode },
            relations: ['owner', 'playlistTracks', 'playlistTracks.track'],
        });
        if (!playlist)
            return null;
        return this.enrichPlaylist(playlist, requesterId);
    }
    async generateShareLink(playlistId, userId) {
        const playlist = await this.findByIdOrFail(playlistId);
        if (playlist.ownerId !== userId) {
            throw new common_1.ForbiddenException('You can only generate share links for your own playlists');
        }
        if (!playlist.shareCode) {
            playlist.shareCode = (0, uuid_1.v4)().replace(/-/g, '').substring(0, 12);
            await this.playlistRepository.save(playlist);
        }
        return playlist.shareCode;
    }
    async addTrack(playlistId, userId, trackInput) {
        const playlist = await this.findByIdOrFail(playlistId);
        if (playlist.ownerId !== userId) {
            throw new common_1.ForbiddenException('You can only add tracks to your own playlists');
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
    async removeTrack(playlistId, userId, trackId) {
        const playlist = await this.findByIdOrFail(playlistId);
        if (playlist.ownerId !== userId) {
            throw new common_1.ForbiddenException('You can only remove tracks from your own playlists');
        }
        await this.playlistTrackRepository.delete({ playlistId, trackId });
        return this.findByIdOrFail(playlistId);
    }
    async reorderTracks(playlistId, userId, trackIds) {
        const playlist = await this.findByIdOrFail(playlistId);
        if (playlist.ownerId !== userId) {
            throw new common_1.ForbiddenException('You can only reorder tracks in your own playlists');
        }
        for (let i = 0; i < trackIds.length; i++) {
            await this.playlistTrackRepository.update({ playlistId, trackId: trackIds[i] }, { position: i + 1 });
        }
        return this.findByIdOrFail(playlistId);
    }
    async enrichPlaylist(playlist, requesterId) {
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
};
exports.PlaylistService = PlaylistService;
exports.PlaylistService = PlaylistService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Playlist)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.Track)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.PlaylistTrack)),
    __param(3, (0, typeorm_1.InjectRepository)(entities_1.Like)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PlaylistService);
//# sourceMappingURL=playlist.service.js.map