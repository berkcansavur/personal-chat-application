"use strict";
exports.__esModule = true;
exports.UserSchema = exports.UserEntity = void 0;
var mongoose = require("mongoose");
var UserEntity = /** @class */ (function () {
    function UserEntity() {
    }
    return UserEntity;
}());
exports.UserEntity = UserEntity;
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
