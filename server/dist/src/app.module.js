"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const mongoose_1 = require("@nestjs/mongoose");
const users_module_1 = require("./users/users.module");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const chat_gateway_1 = require("./chat/chat.gateway");
const chat_groups_module_1 = require("./chat-groups/chat-groups.module");
const auth_module_1 = require("./auth/auth.module");
const cookieSession = require('cookie-session');
const nestjs_session_1 = require("nestjs-session");
const messages_module_1 = require("./messages/messages.module");
let AppModule = exports.AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(cookieSession({
            keys: ['DOMinicALTAN']
        }))
            .forRoutes('*');
        consumer.apply((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            next();
        })
            .forRoutes('*');
    }
};
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: `.env.${process.env.NODE_ENV}`
            }),
            nestjs_session_1.SessionModule.forRoot({
                session: {
                    secret: 'keyboard',
                    resave: false,
                    saveUninitialized: false
                },
            }),
            mongoose_1.MongooseModule.forRoot('mongodb+srv://berkcansavur:8karakter@cluster0.duok4hv.mongodb.net/?retryWrites=true&w=majority'),
            users_module_1.UsersModule,
            chat_groups_module_1.ChatGroupsModule,
            auth_module_1.AuthModule,
            messages_module_1.MessagesModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, {
                provide: core_1.APP_PIPE,
                useValue: new common_1.ValidationPipe({
                    whitelist: true
                })
            }, chat_gateway_1.ChatGateway],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map