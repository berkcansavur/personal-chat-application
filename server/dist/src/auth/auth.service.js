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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const util_1 = require("util");
const crypto_1 = require("crypto");
const scrypt = (0, util_1.promisify)(crypto_1.scrypt);
const jwt_1 = require("@nestjs/jwt");
let AuthService = exports.AuthService = class AuthService {
    constructor(userService, jwtTokenService) {
        this.userService = userService;
        this.jwtTokenService = jwtTokenService;
    }
    async validateUser(email, password) {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new common_1.NotFoundException('User Not Found');
        }
        const [salt, storedHash] = user.password.split('.');
        const hashedPart = (await scrypt(password, salt, 32));
        if (storedHash === hashedPart.toString('hex')) {
            const { _id, name, email } = user;
            return {
                userId: _id,
                userName: name,
                userEmail: email
            };
        }
        return null;
    }
    async loginWithCredentials(user) {
        const payload = {
            sub: user.userId,
            email: user.email,
        };
        const access_token = this.jwtTokenService.sign(payload);
        return {
            access_token: access_token,
            user: {
                userId: user.userId,
                userName: user.name,
                userEmail: user.email
            }
        };
    }
};
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map