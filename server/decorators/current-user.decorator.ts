import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { CurrentUserDTO } from "src/users/dtos/user-dtos";

export const User = createParamDecorator(
    (data: CurrentUserDTO, ctx: ExecutionContext)=>{
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    }
)