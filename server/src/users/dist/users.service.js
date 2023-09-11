"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.UsersService = void 0;
var common_1 = require("@nestjs/common");
var nestjs_1 = require("@automapper/nestjs");
var users_model_1 = require("./users.model");
var user_dtos_1 = require("./dtos/user-dtos");
var UsersService = /** @class */ (function () {
    function UsersService(usersRepository, UserMapper) {
        this.usersRepository = usersRepository;
        this.UserMapper = UserMapper;
        this.logger = new common_1.Logger(UsersService_1.name);
    }
    UsersService_1 = UsersService;
    UsersService.prototype.createUser = function (_a) {
        var createUserDTO = _a.createUserDTO;
        return __awaiter(this, void 0, Promise, function () {
            var _b, UserMapper, logger, newUser;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = this, UserMapper = _b.UserMapper, logger = _b.logger;
                        logger.debug("[UsersService] createUser: " + JSON.stringify(createUserDTO));
                        return [4 /*yield*/, this.usersRepository.createUser({ createUserDTO: createUserDTO })];
                    case 1:
                        newUser = _c.sent();
                        return [2 /*return*/, UserMapper.map(newUser, users_model_1.ReturnUser, user_dtos_1.ReturnUserDTO)];
                }
            });
        });
    };
    UsersService.prototype.findUser = function (_a) {
        var userId = _a.userId;
        return __awaiter(this, void 0, Promise, function () {
            var _b, UserMapper, logger, user, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        _b = this, UserMapper = _b.UserMapper, logger = _b.logger;
                        logger.debug("[UsersService] findUser: userId: " + JSON.stringify(userId));
                        return [4 /*yield*/, this.usersRepository.findUserByObjectId(userId)];
                    case 1:
                        user = _c.sent();
                        return [2 /*return*/, UserMapper.map(user, users_model_1.ReturnUser, user_dtos_1.UserProfileInfoDTO)];
                    case 2:
                        error_1 = _c.sent();
                        throw new Error(error_1);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.getUserToBeValidate = function (_a) {
        var userId = _a.userId;
        return __awaiter(this, void 0, Promise, function () {
            var _b, UserMapper, logger, user, error_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        _b = this, UserMapper = _b.UserMapper, logger = _b.logger;
                        logger.debug("[UsersService] getUserToBeValidate: userId: " + JSON.stringify(userId));
                        return [4 /*yield*/, this.usersRepository.findUserByObjectIdForValidating(userId)];
                    case 1:
                        user = _c.sent();
                        return [2 /*return*/, UserMapper.map(user, users_model_1.UserToBeValidate, user_dtos_1.UserToBeValidateDTO)];
                    case 2:
                        error_2 = _c.sent();
                        throw new Error(error_2);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.findUserByEmail = function (_a) {
        var email = _a.email;
        return __awaiter(this, void 0, Promise, function () {
            var _b, UserMapper, logger, user, error_3;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        _b = this, UserMapper = _b.UserMapper, logger = _b.logger;
                        logger.debug("[UsersService] findUserByEmail: email: " + JSON.stringify(email));
                        return [4 /*yield*/, this.usersRepository.findByEmail(email)];
                    case 1:
                        user = _c.sent();
                        return [2 /*return*/, UserMapper.map(user, users_model_1.ReturnUser, user_dtos_1.UserProfileInfoDTO)];
                    case 2:
                        error_3 = _c.sent();
                        throw new Error(error_3);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.addChatGroupToUser = function (_a) {
        var userId = _a.userId, chatGroupId = _a.chatGroupId;
        return __awaiter(this, void 0, Promise, function () {
            var _b, UserMapper, logger, user, error_4;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        _b = this, UserMapper = _b.UserMapper, logger = _b.logger;
                        logger.debug("[UsersService] addChatGroupToUser: userId: " + JSON.stringify(userId) + ", chatGroupId: " + JSON.stringify(chatGroupId));
                        return [4 /*yield*/, this.usersRepository.addChatGroupToUser(userId, chatGroupId)];
                    case 1:
                        user = _c.sent();
                        return [2 /*return*/, UserMapper.map(user, users_model_1.ReturnUser, user_dtos_1.UserProfileInfoDTO)];
                    case 2:
                        error_4 = _c.sent();
                        throw new Error(error_4);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.removeChatGroupFromUser = function (_a) {
        var userId = _a.userId, chatGroupId = _a.chatGroupId;
        return __awaiter(this, void 0, Promise, function () {
            var _b, UserMapper, logger, user, error_5;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        _b = this, UserMapper = _b.UserMapper, logger = _b.logger;
                        logger.debug("[UsersService] removeChatGroupFromUser: userId: " + JSON.stringify(userId) + ", chatGroupId: " + JSON.stringify(chatGroupId));
                        return [4 /*yield*/, this.usersRepository.removeChatGroupFromUser(userId, chatGroupId)];
                    case 1:
                        user = _c.sent();
                        return [2 /*return*/, UserMapper.map(user, users_model_1.ReturnUser, user_dtos_1.UserProfileInfoDTO)];
                    case 2:
                        error_5 = _c.sent();
                        throw new Error(error_5);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.addFriend = function (_a) {
        var userId = _a.userId, friendId = _a.friendId;
        return __awaiter(this, void 0, Promise, function () {
            var _b, UserMapper, logger, processedUser, error_6;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        _b = this, UserMapper = _b.UserMapper, logger = _b.logger;
                        logger.debug("[UsersService] addFriend: userId: " + JSON.stringify(userId) + ", friendId: " + JSON.stringify(friendId));
                        return [4 /*yield*/, this.usersRepository.addFriend(userId, friendId)];
                    case 1:
                        processedUser = _c.sent();
                        return [2 /*return*/, UserMapper.map(processedUser, users_model_1.ReturnUser, user_dtos_1.FriendInfoDTO)];
                    case 2:
                        error_6 = _c.sent();
                        throw new Error(error_6);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.removeFriend = function (_a) {
        var userId = _a.userId, friendId = _a.friendId;
        return __awaiter(this, void 0, Promise, function () {
            var _b, UserMapper, logger, processedUser, error_7;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        _b = this, UserMapper = _b.UserMapper, logger = _b.logger;
                        logger.debug("[UsersService] removeFriend: userId: " + JSON.stringify(userId) + ", friendId: " + JSON.stringify(friendId));
                        return [4 /*yield*/, this.usersRepository.removeFriend(userId, friendId)];
                    case 1:
                        processedUser = _c.sent();
                        return [2 /*return*/, UserMapper.map(processedUser, users_model_1.ReturnUser, user_dtos_1.FriendInfoDTO)];
                    case 2:
                        error_7 = _c.sent();
                        throw new Error(error_7);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.getFriendIdsOfUser = function (_a) {
        var userId = _a.userId;
        return __awaiter(this, void 0, Promise, function () {
            var logger, error_8;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        logger = this.logger;
                        logger.debug("[UsersService] getFriendIdsOfUser: userId: " + JSON.stringify(userId));
                        return [4 /*yield*/, this.usersRepository.getFriendsOfUser(userId)];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2:
                        error_8 = _b.sent();
                        throw new Error(error_8);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.getUsersFriendsInfo = function (_a) {
        var userIds = _a.userIds;
        return __awaiter(this, void 0, Promise, function () {
            var _b, UserMapper_1, logger, users, usersData, error_9;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        _b = this, UserMapper_1 = _b.UserMapper, logger = _b.logger;
                        logger.debug("[UsersService] getUsersFriendsInfo: userIds: " + JSON.stringify(userIds));
                        return [4 /*yield*/, this.usersRepository.getUserFriends(userIds)];
                    case 1:
                        users = _c.sent();
                        usersData = Promise.all(users.map(function (user) {
                            return UserMapper_1.map(user, users_model_1.ReturnUser, user_dtos_1.FriendInfoDTO);
                        }));
                        return [2 /*return*/, usersData];
                    case 2:
                        error_9 = _c.sent();
                        throw new Error(error_9);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.mapUserProfileInfo = function (_a) {
        var userId = _a.userId, name = _a.name, email = _a.email, chatGroupDetails = _a.chatGroupDetails, friendsData = _a.friendsData;
        return __awaiter(this, void 0, void 0, function () {
            var _b, UserMapper, logger, userProfileInfo;
            return __generator(this, function (_c) {
                _b = this, UserMapper = _b.UserMapper, logger = _b.logger;
                logger.debug("[UsersService] mapUserProfileInfo:" + JSON.stringify({ userId: userId, name: name, email: email, chatGroupDetails: chatGroupDetails, friendsData: friendsData }));
                userProfileInfo = new user_dtos_1.UserProfileInfoDTO();
                userProfileInfo.UserId = userId;
                userProfileInfo.UserName = name;
                userProfileInfo.UserEmail = email;
                userProfileInfo.ChatGroups = chatGroupDetails;
                userProfileInfo.Friends = friendsData;
                return [2 /*return*/, UserMapper.map(userProfileInfo, user_dtos_1.UserProfileInfoDTO, users_model_1.ReturnUserProfile)];
            });
        });
    };
    UsersService.prototype.searchUser = function (_a) {
        var searchText = _a.searchText;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.usersRepository.searchUser(searchText)];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    var UsersService_1;
    UsersService = UsersService_1 = __decorate([
        common_1.Injectable(),
        __param(1, nestjs_1.InjectMapper())
    ], UsersService);
    return UsersService;
}());
exports.UsersService = UsersService;
