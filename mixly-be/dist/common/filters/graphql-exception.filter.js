"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("graphql");
const app_exceptions_1 = require("../exceptions/app.exceptions");
let GraphQLExceptionFilter = class GraphQLExceptionFilter {
    catch(exception, host) {
        const gqlHost = graphql_1.GqlArgumentsHost.create(host);
        if (exception instanceof app_exceptions_1.AppException) {
            return new graphql_2.GraphQLError(exception.message, {
                extensions: {
                    code: exception.code,
                    statusCode: exception.getStatus(),
                    details: exception.details,
                },
            });
        }
        if (exception instanceof common_1.HttpException) {
            const response = exception.getResponse();
            const message = typeof response === 'string'
                ? response
                : response.message || exception.message;
            return new graphql_2.GraphQLError(Array.isArray(message) ? message[0] : message, {
                extensions: {
                    code: 'HTTP_EXCEPTION',
                    statusCode: exception.getStatus(),
                },
            });
        }
        if (exception instanceof graphql_2.GraphQLError) {
            return exception;
        }
        console.error('Unhandled exception:', exception);
        return new graphql_2.GraphQLError('Internal server error', {
            extensions: {
                code: 'INTERNAL_SERVER_ERROR',
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
            },
        });
    }
};
exports.GraphQLExceptionFilter = GraphQLExceptionFilter;
exports.GraphQLExceptionFilter = GraphQLExceptionFilter = __decorate([
    (0, common_1.Catch)()
], GraphQLExceptionFilter);
//# sourceMappingURL=graphql-exception.filter.js.map