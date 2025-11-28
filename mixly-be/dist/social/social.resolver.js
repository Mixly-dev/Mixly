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
exports.SocialResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const social_service_1 = require("./social.service");
const auth_1 = require("../auth");
const user_entity_1 = require("../entities/user.entity");
const playlist_dto_1 = require("../playlist/dto/playlist.dto");
let SocialResolver = class SocialResolver {
    constructor(socialService) {
        this.socialService = socialService;
    }
    async follow(user, userId) {
        return this.socialService.follow(user.id, userId);
    }
    async unfollow(user, userId) {
        return this.socialService.unfollow(user.id, userId);
    }
    async likePlaylist(user, playlistId) {
        return this.socialService.likePlaylist(user.id, playlistId);
    }
    async unlikePlaylist(user, playlistId) {
        return this.socialService.unlikePlaylist(user.id, playlistId);
    }
    async feed(user, pagination) {
        return this.socialService.getFeed(user.id, pagination || {});
    }
};
exports.SocialResolver = SocialResolver;
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, common_1.UseGuards)(auth_1.GqlAuthGuard),
    __param(0, (0, auth_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('userId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], SocialResolver.prototype, "follow", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, common_1.UseGuards)(auth_1.GqlAuthGuard),
    __param(0, (0, auth_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('userId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], SocialResolver.prototype, "unfollow", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, common_1.UseGuards)(auth_1.GqlAuthGuard),
    __param(0, (0, auth_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('playlistId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], SocialResolver.prototype, "likePlaylist", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, common_1.UseGuards)(auth_1.GqlAuthGuard),
    __param(0, (0, auth_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('playlistId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], SocialResolver.prototype, "unlikePlaylist", null);
__decorate([
    (0, graphql_1.Query)(() => playlist_dto_1.PlaylistConnection),
    (0, common_1.UseGuards)(auth_1.GqlAuthGuard),
    __param(0, (0, auth_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('pagination', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        playlist_dto_1.PaginationInput]),
    __metadata("design:returntype", Promise)
], SocialResolver.prototype, "feed", null);
exports.SocialResolver = SocialResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [social_service_1.SocialService])
], SocialResolver);
//# sourceMappingURL=social.resolver.js.map