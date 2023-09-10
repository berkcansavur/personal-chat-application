"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UserSchema = exports.ReturnUserProfile = exports.UserToBeValidate = exports.ReturnUser = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose = require("mongoose");
var mongoose_2 = require("mongoose");
var ReturnUser = /** @class */ (function () {
    function ReturnUser() {
    }
    __decorate([
        mongoose_1.Prop({ type: mongoose_2.Schema.Types.ObjectId, auto: true })
    ], ReturnUser.prototype, "_id");
    __decorate([
        mongoose_1.Prop({ type: String, required: true })
    ], ReturnUser.prototype, "name");
    __decorate([
        mongoose_1.Prop({ type: String, required: true })
    ], ReturnUser.prototype, "email");
    __decorate([
        mongoose_1.Prop({ type: [] })
    ], ReturnUser.prototype, "ChatGroups");
    __decorate([
        mongoose_1.Prop({ type: [] })
    ], ReturnUser.prototype, "Friends");
    return ReturnUser;
}());
exports.ReturnUser = ReturnUser;
var UserToBeValidate = /** @class */ (function () {
    function UserToBeValidate() {
    }
    __decorate([
        mongoose_1.Prop({ type: mongoose_2.Schema.Types.ObjectId, auto: true })
    ], UserToBeValidate.prototype, "_id");
    __decorate([
        mongoose_1.Prop({ type: String, required: true })
    ], UserToBeValidate.prototype, "email");
    __decorate([
        mongoose_1.Prop({ type: String, required: true })
    ], UserToBeValidate.prototype, "password");
    return UserToBeValidate;
}());
exports.UserToBeValidate = UserToBeValidate;
var ReturnUserProfile = /** @class */ (function () {
    function ReturnUserProfile() {
    }
    __decorate([
        mongoose_1.Prop({ type: mongoose_2.Schema.Types.ObjectId, auto: true })
    ], ReturnUserProfile.prototype, "_id");
    __decorate([
        mongoose_1.Prop({ type: String, required: true })
    ], ReturnUserProfile.prototype, "name");
    __decorate([
        mongoose_1.Prop({ type: String, required: true })
    ], ReturnUserProfile.prototype, "email");
    __decorate([
        mongoose_1.Prop({ type: [] })
    ], ReturnUserProfile.prototype, "ChatGroups");
    __decorate([
        mongoose_1.Prop({ type: [] })
    ], ReturnUserProfile.prototype, "Friends");
    return ReturnUserProfile;
}());
exports.ReturnUserProfile = ReturnUserProfile;
exports.UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    ChatGroups: [{
            chatGroup: { type: Object }
        }],
    Friends: [{
            friend: { type: Object }
        }]
}, { timestamps: true });
