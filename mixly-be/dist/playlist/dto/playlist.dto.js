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
exports.PlaylistConnection = exports.PlaylistEdge = exports.PaginationInput = exports.TrackInput = exports.UpdatePlaylistInput = exports.CreatePlaylistInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
const playlist_entity_1 = require("../../entities/playlist.entity");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
let CreatePlaylistInput = class CreatePlaylistInput {
};
exports.CreatePlaylistInput = CreatePlaylistInput;
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreatePlaylistInput.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreatePlaylistInput.prototype, "description", void 0);
__decorate([
    (0, graphql_1.Field)(() => playlist_entity_1.PlaylistVisibility, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(playlist_entity_1.PlaylistVisibility),
    __metadata("design:type", String)
], CreatePlaylistInput.prototype, "visibility", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePlaylistInput.prototype, "genre", void 0);
exports.CreatePlaylistInput = CreatePlaylistInput = __decorate([
    (0, graphql_1.InputType)()
], CreatePlaylistInput);
let UpdatePlaylistInput = class UpdatePlaylistInput {
};
exports.UpdatePlaylistInput = UpdatePlaylistInput;
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdatePlaylistInput.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdatePlaylistInput.prototype, "description", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePlaylistInput.prototype, "coverImageUrl", void 0);
__decorate([
    (0, graphql_1.Field)(() => playlist_entity_1.PlaylistVisibility, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(playlist_entity_1.PlaylistVisibility),
    __metadata("design:type", String)
], UpdatePlaylistInput.prototype, "visibility", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePlaylistInput.prototype, "genre", void 0);
exports.UpdatePlaylistInput = UpdatePlaylistInput = __decorate([
    (0, graphql_1.InputType)()
], UpdatePlaylistInput);
let TrackInput = class TrackInput {
};
exports.TrackInput = TrackInput;
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TrackInput.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TrackInput.prototype, "artist", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TrackInput.prototype, "album", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], TrackInput.prototype, "duration", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TrackInput.prototype, "coverImageUrl", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TrackInput.prototype, "externalUrl", void 0);
exports.TrackInput = TrackInput = __decorate([
    (0, graphql_1.InputType)()
], TrackInput);
let PaginationInput = class PaginationInput {
};
exports.PaginationInput = PaginationInput;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true, defaultValue: 20 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PaginationInput.prototype, "first", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PaginationInput.prototype, "after", void 0);
exports.PaginationInput = PaginationInput = __decorate([
    (0, graphql_1.InputType)()
], PaginationInput);
let PlaylistEdge = class PlaylistEdge {
};
exports.PlaylistEdge = PlaylistEdge;
__decorate([
    (0, graphql_1.Field)(() => playlist_entity_1.Playlist),
    __metadata("design:type", playlist_entity_1.Playlist)
], PlaylistEdge.prototype, "node", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], PlaylistEdge.prototype, "cursor", void 0);
exports.PlaylistEdge = PlaylistEdge = __decorate([
    (0, graphql_1.ObjectType)()
], PlaylistEdge);
let PlaylistConnection = class PlaylistConnection {
};
exports.PlaylistConnection = PlaylistConnection;
__decorate([
    (0, graphql_1.Field)(() => [PlaylistEdge]),
    __metadata("design:type", Array)
], PlaylistConnection.prototype, "edges", void 0);
__decorate([
    (0, graphql_1.Field)(() => pagination_dto_1.PageInfo),
    __metadata("design:type", pagination_dto_1.PageInfo)
], PlaylistConnection.prototype, "pageInfo", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], PlaylistConnection.prototype, "totalCount", void 0);
exports.PlaylistConnection = PlaylistConnection = __decorate([
    (0, graphql_1.ObjectType)()
], PlaylistConnection);
//# sourceMappingURL=playlist.dto.js.map