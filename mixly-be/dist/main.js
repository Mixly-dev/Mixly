"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const graphql_exception_filter_1 = require("./common/filters/graphql-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    app.useGlobalFilters(new graphql_exception_filter_1.GraphQLExceptionFilter());
    app.enableCors();
    await app.listen(3000);
    console.log(`Application is running on: http://localhost:3000/graphql`);
}
bootstrap();
//# sourceMappingURL=main.js.map