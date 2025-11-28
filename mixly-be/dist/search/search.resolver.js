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
exports.SearchResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const search_service_1 = require("./search.service");
const search_dto_1 = require("./dto/search.dto");
const playlist_dto_1 = require("../playlist/dto/playlist.dto");
let SearchResolver = class SearchResolver {
    constructor(searchService) {
        this.searchService = searchService;
    }
    async search(query, filters, pagination) {
        return this.searchService.search(query, filters || {}, pagination || {});
    }
    async trending(timeRange, pagination) {
        return this.searchService.getTrending(timeRange, pagination || {});
    }
};
exports.SearchResolver = SearchResolver;
__decorate([
    (0, graphql_1.Query)(() => search_dto_1.SearchResult),
    __param(0, (0, graphql_1.Args)('query')),
    __param(1, (0, graphql_1.Args)('filters', { nullable: true })),
    __param(2, (0, graphql_1.Args)('pagination', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, search_dto_1.SearchFilters,
        playlist_dto_1.PaginationInput]),
    __metadata("design:returntype", Promise)
], SearchResolver.prototype, "search", null);
__decorate([
    (0, graphql_1.Query)(() => playlist_dto_1.PlaylistConnection),
    __param(0, (0, graphql_1.Args)('timeRange', { type: () => search_dto_1.TimeRange, nullable: true, defaultValue: search_dto_1.TimeRange.WEEK })),
    __param(1, (0, graphql_1.Args)('pagination', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, playlist_dto_1.PaginationInput]),
    __metadata("design:returntype", Promise)
], SearchResolver.prototype, "trending", null);
exports.SearchResolver = SearchResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [search_service_1.SearchService])
], SearchResolver);
//# sourceMappingURL=search.resolver.js.map