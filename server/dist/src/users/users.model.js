"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = exports.UserEntity = void 0;
const mongoose = require("mongoose");
class UserEntity {
}
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
//# sourceMappingURL=users.model.js.map