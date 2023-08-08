"use strict";
exports.__esModule = true;
exports.CurrentUser = void 0;
var common_1 = require("@nestjs/common");
exports.CurrentUser = common_1.createParamDecorator(function (data, context) {
    var request = context.switchToHttp().getRequest();
    return request.CurrentUser;
});
