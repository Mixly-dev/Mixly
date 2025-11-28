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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Playlist = exports.PlaylistVisibility = void 0;
const typeorm_1 = require("typeorm");
const graphql_1 = require("@nestjs/graphql");
const user_entity_1 = require("./user.entity");
const playlist_track_entity_1 = require("./playlist-track.entity");
var PlaylistVisibility;
(function (PlaylistVisibility) {
    PlaylistVisibility["PUBLIC"] = "PUBLIC";
    PlaylistVisibility["PRIVATE"] = "PRIVATE";
})(PlaylistVisibility || (exports.PlaylistVisibility = PlaylistVisibility = {}));
(0, graphql_1.registerEnumType)(PlaylistVisibility, {
    name: 'PlaylistVisibility',
});
let Playlist = class Playlist {
};
exports.Playlist = Playlist;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Playlist.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Playlist.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Playlist.prototype, "description", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Playlist.prototype, "coverImageUrl", void 0);
__decorate([
    (0, graphql_1.Field)(() => PlaylistVisibility),
    (0, typeorm_1.Column)({ type: 'enum', enum: PlaylistVisibility, default: PlaylistVisibility.PRIVATE }),
    __metadata("design:type", String)
], Playlist.prototype, "visibility", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ unique: true, nullable: true }),
    __metadata("design:type", String)
], Playlist.prototype, "shareCode", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Playlist.prototype, "genre", void 0);
__decorate([
    (0, graphql_1.Field)(() => user_entity_1.User),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.playlists),
    (0, typeorm_1.JoinColumn)({ name: 'ownerId' }),
    __metadata("design:type", user_entity_1.User)
], Playlist.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Playlist.prototype, "ownerId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => playlist_track_entity_1.PlaylistTrack, (pt) => pt.playlist, { cascade: true }),
    __metadata("design:type", Array)
], Playlist.prototype, "playlistTracks", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], Playlist.prototype, "trackCount", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], Playlist.prototype, "likeCount", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], Playlist.prototype, "isLiked", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Playlist.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Playlist.prototype, "updatedAt", void 0);
exports.Playlist = Playlist = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)('playlists')
], Playlist);
//# sourceMappingURL=playlist.entity.js.map