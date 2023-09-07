"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
var user_profile_info_dto_1 = require("./dtos/user-profile-info.dto");
var add_or_remove_friend_dto_1 = require("./dtos/add-or-remove-friend.dto");
var UsersService = /** @class */ (function () {
    function UsersService(usersRepository) {
        this.usersRepository = usersRepository;
    }
    UsersService.prototype.createUser = function (_a) {
        var name = _a.name, email = _a.email, password = _a.password;
        return __awaiter(this, void 0, Promise, function () {
            var newUser;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.usersRepository.createUser(name, email, password)];
                    case 1:
                        newUser = _b.sent();
                        return [2 /*return*/, newUser];
                }
            });
        });
    };
    UsersService.prototype.findUser = function (_a) {
        var id = _a.id;
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        if (!id) {
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, this.usersRepository.findUserByObjectId(id)];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2:
                        error_1 = _b.sent();
                        throw new Error(error_1);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.findUserByEmail = function (_a) {
        var email = _a.email;
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.usersRepository.findByEmail(email)];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2:
                        error_2 = _b.sent();
                        throw new Error(error_2);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.addChatGroupToUser = function (_a) {
        var userId = _a.userId, chatGroup = _a.chatGroup;
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.usersRepository.addChatGroupToUser(userId, chatGroup)];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2:
                        error_3 = _b.sent();
                        throw new Error(error_3);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.removeChatGroupFromUser = function (_a) {
        var user = _a.user, chatGroup = _a.chatGroup;
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.usersRepository.removeChatGroupFromUser(user, chatGroup)];
                    case 1:
                        _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _b.sent();
                        throw new Error(error_4);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.addFriend = function (_a) {
        var userId = _a.userId, friend = _a.friend;
        return __awaiter(this, void 0, void 0, function () {
            var processedUser, _id, name, email, ChatGroups, Friends, updatedUserDTO, error_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.usersRepository.addFriend(userId, friend)];
                    case 1:
                        processedUser = _b.sent();
                        _id = processedUser._id, name = processedUser.name, email = processedUser.email, ChatGroups = processedUser.ChatGroups, Friends = processedUser.Friends;
                        updatedUserDTO = new add_or_remove_friend_dto_1.FriendRelatedOperationsDTO();
                        updatedUserDTO._id = _id;
                        updatedUserDTO.name = name;
                        updatedUserDTO.email = email;
                        updatedUserDTO.ChatGroups = ChatGroups;
                        updatedUserDTO.Friends = Friends;
                        return [2 /*return*/, updatedUserDTO];
                    case 2:
                        error_5 = _b.sent();
                        throw new Error(error_5);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.removeFriend = function (_a) {
        var userId = _a.userId, friendId = _a.friendId;
        return __awaiter(this, void 0, void 0, function () {
            var processedUser, _id, name, email, ChatGroups, Friends, updatedUserDTO, error_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.usersRepository.removeFriend(userId, friendId)];
                    case 1:
                        processedUser = _b.sent();
                        _id = processedUser._id, name = processedUser.name, email = processedUser.email, ChatGroups = processedUser.ChatGroups, Friends = processedUser.Friends;
                        updatedUserDTO = new add_or_remove_friend_dto_1.FriendRelatedOperationsDTO();
                        updatedUserDTO._id = _id;
                        updatedUserDTO.name = name;
                        updatedUserDTO.email = email;
                        updatedUserDTO.ChatGroups = ChatGroups;
                        updatedUserDTO.Friends = Friends;
                        return [2 /*return*/, updatedUserDTO];
                    case 2:
                        error_6 = _b.sent();
                        throw new Error(error_6);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.getFriendsOfUser = function (_a) {
        var userId = _a.userId;
        return __awaiter(this, void 0, void 0, function () {
            var error_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.usersRepository.getFriendsOfUser(userId)];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2:
                        error_7 = _b.sent();
                        throw new Error(error_7);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.getUserData = function (_a) {
        var userObject = _a.userObject;
        return __awaiter(this, void 0, void 0, function () {
            var error_8;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.usersRepository.getUserData(userObject)];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2:
                        error_8 = _b.sent();
                        throw new Error(error_8);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.getUsersFriendsData = function (_a) {
        var userId = _a.userId;
        return __awaiter(this, void 0, void 0, function () {
            var error_9;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.usersRepository.getUsersFriendsData(userId)];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2:
                        error_9 = _b.sent();
                        throw new Error(error_9);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.getUserProfileInfo = function (_a) {
        var id = _a.id, name = _a.name, email = _a.email, chatGroupDetails = _a.chatGroupDetails, friendsData = _a.friendsData;
        return __awaiter(this, void 0, void 0, function () {
            var userProfileInfo;
            return __generator(this, function (_b) {
                userProfileInfo = new user_profile_info_dto_1.UserProfileInfoDTO();
                userProfileInfo.UserId = id;
                userProfileInfo.UserName = name;
                userProfileInfo.UserEmail = email;
                userProfileInfo.ChatGroups = chatGroupDetails;
                userProfileInfo.Friends = friendsData;
                return [2 /*return*/, userProfileInfo];
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
    UsersService = __decorate([
        common_1.Injectable()
    ], UsersService);
    return UsersService;
}());
exports.UsersService = UsersService;
