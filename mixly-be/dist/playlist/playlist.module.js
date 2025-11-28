"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaylistModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const playlist_service_1 = require("./playlist.service");
const playlist_resolver_1 = require("./playlist.resolver");
const entities_1 = require("../entities");
const auth_module_1 = require("../auth/auth.module");
let PlaylistModule = class PlaylistModule {
};
exports.PlaylistModule = PlaylistModule;
exports.PlaylistModule = PlaylistModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([entities_1.Playlist, entities_1.Track, entities_1.PlaylistTrack, entities_1.Like]),
            auth_module_1.AuthModule,
        ],
        providers: [playlist_service_1.PlaylistService, playlist_resolver_1.PlaylistResolver],
        exports: [playlist_service_1.PlaylistService],
    })
], PlaylistModule);
//# sourceMappingURL=playlist.module.js.map