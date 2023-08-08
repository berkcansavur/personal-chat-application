"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilsService = exports.jwtConstants = void 0;
const common_1 = require("@nestjs/common");
const util_1 = require("util");
const crypto_1 = require("crypto");
const scrypt = (0, util_1.promisify)(crypto_1.scrypt);
exports.jwtConstants = {
    secret: 'secretKey',
};
let UtilsService = exports.UtilsService = class UtilsService {
    async hashPassword(password) {
        const salt = (0, crypto_1.randomBytes)(8).toString('hex');
        const hash = await scrypt(password, salt, 32);
        const generatedPassword = salt + '.' + hash.toString('hex');
        return generatedPassword;
    }
};
exports.UtilsService = UtilsService = __decorate([
    (0, common_1.Injectable)()
], UtilsService);
//# sourceMappingURL=utils.service.js.map