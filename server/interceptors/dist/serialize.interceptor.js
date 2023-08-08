"use strict";
exports.__esModule = true;
exports.SerializeInterceptor = exports.Serialize = void 0;
var common_1 = require("@nestjs/common");
var rxjs_1 = require("rxjs");
var class_transformer_1 = require("class-transformer");
function Serialize(dto) {
    return common_1.UseInterceptors(new SerializeInterceptor(dto));
}
exports.Serialize = Serialize;
var SerializeInterceptor = /** @class */ (function () {
    function SerializeInterceptor(dto) {
        this.dto = dto;
    }
    SerializeInterceptor.prototype.intercept = function (context, handler) {
        var _this = this;
        // Handling request before execution of request handler
        console.log('before handler', context);
        // Possible authentication can be done in this layer
        return handler.handle().pipe(rxjs_1.map(function (data) {
            // Run something before response is sent out
            console.log(' After response is sent out');
            return class_transformer_1.plainToClass(_this.dto, data, {
                excludeExtraneousValues: true
            });
        }));
    };
    return SerializeInterceptor;
}());
exports.SerializeInterceptor = SerializeInterceptor;
