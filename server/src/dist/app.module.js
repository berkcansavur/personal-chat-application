"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var app_controller_1 = require("./app.controller");
var app_service_1 = require("./app.service");
var mongoose_1 = require("@nestjs/mongoose");
var users_module_1 = require("./users/users.module");
var config_1 = require("@nestjs/config");
var core_1 = require("@nestjs/core");
var cookieSession = require('cookie-session');
var AppModule = /** @class */ (function () {
    function AppModule(configService) {
        this.configService = configService;
    }
    AppModule.prototype.configure = function (consumer) {
        consumer.apply(cookieSession({
            keys: [this.configService.get('COOKIE_KEY')]
        })).forRoutes('*');
    };
    AppModule = __decorate([
        common_1.Module({
            imports: [
                config_1.ConfigModule.forRoot({
                    isGlobal: true,
                    envFilePath: ".env." + process.env.NODE_ENV
                }),
                mongoose_1.MongooseModule.forRoot('mongodb+srv://berkcansavur:8karakter@cluster0.duok4hv.mongodb.net/?retryWrites=true&w=majority'),
                users_module_1.UsersModule,
            ],
            controllers: [app_controller_1.AppController],
            providers: [app_service_1.AppService, {
                    provide: core_1.APP_PIPE,
                    useValue: new common_1.ValidationPipe({
                        whitelist: true
                    })
                }]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
