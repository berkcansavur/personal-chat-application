import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
function isAuthenticated(request: any): boolean {
  return request.session && request.session.userId !== undefined;
}
@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    return isAuthenticated(request)
  }
}