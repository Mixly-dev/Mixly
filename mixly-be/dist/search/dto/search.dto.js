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
exports.SearchResult = exports.SearchFilters = exports.TimeRange = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
const playlist_dto_1 = require("../../playlist/dto/playlist.dto");
const social_dto_1 = require("../../social/dto/social.dto");
var TimeRange;
(function (TimeRange) {
    TimeRange["DAY"] = "DAY";
    TimeRange["WEEK"] = "WEEK";
    TimeRange["MONTH"] = "MONTH";
    TimeRange["ALL_TIME"] = "ALL_TIME";
})(TimeRange || (exports.TimeRange = TimeRange = {}));
(0, graphql_1.registerEnumType)(TimeRange, {
    name: 'TimeRange',
});
let SearchFilters = class SearchFilters {
};
exports.SearchFilters = SearchFilters;
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchFilters.prototype, "genre", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchFilters.prototype, "category", void 0);
exports.SearchFilters = SearchFilters = __decorate([
    (0, graphql_1.InputType)()
], SearchFilters);
let SearchResult = class SearchResult {
};
exports.SearchResult = SearchResult;
__decorate([
    (0, graphql_1.Field)(() => playlist_dto_1.PlaylistConnection),
    __metadata("design:type", playlist_dto_1.PlaylistConnection)
], SearchResult.prototype, "playlists", void 0);
__decorate([
    (0, graphql_1.Field)(() => social_dto_1.UserConnection),
    __metadata("design:type", social_dto_1.UserConnection)
], SearchResult.prototype, "users", void 0);
exports.SearchResult = SearchResult = __decorate([
    (0, graphql_1.ObjectType)()
], SearchResult);
//# sourceMappingURL=search.dto.js.map