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
exports.UserConnection = exports.UserEdge = void 0;
const graphql_1 = require("@nestjs/graphql");
const user_entity_1 = require("../../entities/user.entity");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
let UserEdge = class UserEdge {
};
exports.UserEdge = UserEdge;
__decorate([
    (0, graphql_1.Field)(() => user_entity_1.User),
    __metadata("design:type", user_entity_1.User)
], UserEdge.prototype, "node", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], UserEdge.prototype, "cursor", void 0);
exports.UserEdge = UserEdge = __decorate([
    (0, graphql_1.ObjectType)()
], UserEdge);
let UserConnection = class UserConnection {
};
exports.UserConnection = UserConnection;
__decorate([
    (0, graphql_1.Field)(() => [UserEdge]),
    __metadata("design:type", Array)
], UserConnection.prototype, "edges", void 0);
__decorate([
    (0, graphql_1.Field)(() => pagination_dto_1.PageInfo),
    __metadata("design:type", pagination_dto_1.PageInfo)
], UserConnection.prototype, "pageInfo", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], UserConnection.prototype, "totalCount", void 0);
exports.UserConnection = UserConnection = __decorate([
    (0, graphql_1.ObjectType)()
], UserConnection);
//# sourceMappingURL=social.dto.js.map