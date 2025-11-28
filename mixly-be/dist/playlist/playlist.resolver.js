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
exports.PlaylistResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const playlist_service_1 = require("./playlist.service");
const entities_1 = require("../entities");
const auth_1 = require("../auth");
const user_entity_1 = require("../entities/user.entity");
const playlist_dto_1 = require("./dto/playlist.dto");
let PlaylistResolver = class PlaylistResolver {
    constructor(playlistService) {
        this.playlistService = playlistService;
    }
    async playlist(id, user) {
        return this.playlistService.findById(id, user?.id);
    }
    async playlistByShareCode(shareCode, user) {
        return this.playlistService.findByShareCode(shareCode, user?.id);
    }
    async myPlaylists(user, pagination) {
        return this.playlistService.findByUser(user.id, pagination || {}, user.id);
    }
    async createPlaylist(user, input) {
        return this.playlistService.create(user.id, input);
    }
    async updatePlaylist(user, id, input) {
        return this.playlistService.update(id, user.id, input);
    }
    async deletePlaylist(user, id) {
        return this.playlistService.delete(id, user.id);
    }
    async addTrackToPlaylist(user, playlistId, track) {
        return this.playlistService.addTrack(playlistId, user.id, track);
    }
    async removeTrackFromPlaylist(user, playlistId, trackId) {
        return this.playlistService.removeTrack(playlistId, user.id, trackId);
    }
    async reorderPlaylistTracks(user, playlistId, trackIds) {
        return this.playlistService.reorderTracks(playlistId, user.id, trackIds);
    }
    async generatePlaylistShareLink(user, playlistId) {
        return this.playlistService.generateShareLink(playlistId, user.id);
    }
    tracks(playlist) {
        if (!playlist.playlistTracks)
            return [];
        return playlist.playlistTracks
            .sort((a, b) => a.position - b.position)
            .map((pt, index) => ({
            ...pt.track,
            position: index + 1,
        }));
    }
};
exports.PlaylistResolver = PlaylistResolver;
__decorate([
    (0, graphql_1.Query)(() => entities_1.Playlist, { nullable: true }),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __param(1, (0, auth_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], PlaylistResolver.prototype, "playlist", null);
__decorate([
    (0, graphql_1.Query)(() => entities_1.Playlist, { nullable: true }),
    __param(0, (0, graphql_1.Args)('shareCode')),
    __param(1, (0, auth_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], PlaylistResolver.prototype, "playlistByShareCode", null);
__decorate([
    (0, graphql_1.Query)(() => playlist_dto_1.PlaylistConnection),
    (0, common_1.UseGuards)(auth_1.GqlAuthGuard),
    __param(0, (0, auth_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('pagination', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        playlist_dto_1.PaginationInput]),
    __metadata("design:returntype", Promise)
], PlaylistResolver.prototype, "myPlaylists", null);
__decorate([
    (0, graphql_1.Mutation)(() => entities_1.Playlist),
    (0, common_1.UseGuards)(auth_1.GqlAuthGuard),
    __param(0, (0, auth_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        playlist_dto_1.CreatePlaylistInput]),
    __metadata("design:returntype", Promise)
], PlaylistResolver.prototype, "createPlaylist", null);
__decorate([
    (0, graphql_1.Mutation)(() => entities_1.Playlist),
    (0, common_1.UseGuards)(auth_1.GqlAuthGuard),
    __param(0, (0, auth_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __param(2, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, playlist_dto_1.UpdatePlaylistInput]),
    __metadata("design:returntype", Promise)
], PlaylistResolver.prototype, "updatePlaylist", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, common_1.UseGuards)(auth_1.GqlAuthGuard),
    __param(0, (0, auth_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], PlaylistResolver.prototype, "deletePlaylist", null);
__decorate([
    (0, graphql_1.Mutation)(() => entities_1.Playlist),
    (0, common_1.UseGuards)(auth_1.GqlAuthGuard),
    __param(0, (0, auth_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('playlistId', { type: () => graphql_1.ID })),
    __param(2, (0, graphql_1.Args)('track')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, playlist_dto_1.TrackInput]),
    __metadata("design:returntype", Promise)
], PlaylistResolver.prototype, "addTrackToPlaylist", null);
__decorate([
    (0, graphql_1.Mutation)(() => entities_1.Playlist),
    (0, common_1.UseGuards)(auth_1.GqlAuthGuard),
    __param(0, (0, auth_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('playlistId', { type: () => graphql_1.ID })),
    __param(2, (0, graphql_1.Args)('trackId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, String]),
    __metadata("design:returntype", Promise)
], PlaylistResolver.prototype, "removeTrackFromPlaylist", null);
__decorate([
    (0, graphql_1.Mutation)(() => entities_1.Playlist),
    (0, common_1.UseGuards)(auth_1.GqlAuthGuard),
    __param(0, (0, auth_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('playlistId', { type: () => graphql_1.ID })),
    __param(2, (0, graphql_1.Args)('trackIds', { type: () => [graphql_1.ID] })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, Array]),
    __metadata("design:returntype", Promise)
], PlaylistResolver.prototype, "reorderPlaylistTracks", null);
__decorate([
    (0, graphql_1.Mutation)(() => String),
    (0, common_1.UseGuards)(auth_1.GqlAuthGuard),
    __param(0, (0, auth_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('playlistId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], PlaylistResolver.prototype, "generatePlaylistShareLink", null);
__decorate([
    (0, graphql_1.ResolveField)(() => [entities_1.Track]),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entities_1.Playlist]),
    __metadata("design:returntype", Array)
], PlaylistResolver.prototype, "tracks", null);
exports.PlaylistResolver = PlaylistResolver = __decorate([
    (0, graphql_1.Resolver)(() => entities_1.Playlist),
    __metadata("design:paramtypes", [playlist_service_1.PlaylistService])
], PlaylistResolver);
//# sourceMappingURL=playlist.resolver.js.map