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
exports.PlaylistTrack = void 0;
const typeorm_1 = require("typeorm");
const playlist_entity_1 = require("./playlist.entity");
const track_entity_1 = require("./track.entity");
let PlaylistTrack = class PlaylistTrack {
};
exports.PlaylistTrack = PlaylistTrack;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PlaylistTrack.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => playlist_entity_1.Playlist, (playlist) => playlist.playlistTracks, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'playlistId' }),
    __metadata("design:type", playlist_entity_1.Playlist)
], PlaylistTrack.prototype, "playlist", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PlaylistTrack.prototype, "playlistId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => track_entity_1.Track, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'trackId' }),
    __metadata("design:type", track_entity_1.Track)
], PlaylistTrack.prototype, "track", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PlaylistTrack.prototype, "trackId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], PlaylistTrack.prototype, "position", void 0);
exports.PlaylistTrack = PlaylistTrack = __decorate([
    (0, typeorm_1.Entity)('playlist_tracks')
], PlaylistTrack);
//# sourceMappingURL=playlist-track.entity.js.map