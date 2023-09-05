import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { CurrentUserDTO } from "src/users/dtos/current-user.dto";

export const User = createParamDecorator(
    (data: CurrentUserDTO, ctx: ExecutionContext)=>{
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    }
)