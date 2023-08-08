"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerializeInterceptor = exports.SerializeEvents = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const class_transformer_1 = require("class-transformer");
function SerializeEvents(dto) {
    return (0, common_1.UseInterceptors)(new SerializeInterceptor(dto));
}
exports.SerializeEvents = SerializeEvents;
class SerializeInterceptor {
    constructor(dto) {
        this.dto = dto;
    }
    intercept(context, handler) {
        console.log('before handler', context.switchToHttp().getRequest());
        return handler.handle().pipe((0, rxjs_1.map)((data) => {
            console.log(' After response is sent out');
            return (0, class_transformer_1.plainToClass)(this.dto, data, {
                excludeExtraneousValues: true
            });
        }));
    }
}
exports.SerializeInterceptor = SerializeInterceptor;
//# sourceMappingURL=event-logs.interceptor.js.map