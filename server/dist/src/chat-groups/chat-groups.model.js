"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGroupsSchema = void 0;
const mongoose = require("mongoose");
exports.ChatGroupsSchema = new mongoose.Schema({
    chatGroupName: { type: String, required: true },
    users: [{
            user: { type: Object }
        }],
    createdDate: { type: Date }
}, { timestamps: true });
//# sourceMappingURL=chat-groups.model.js.map