import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core/services/reflector.service";
import { Role, ROLES_KEY } from "../decorators/role.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(ctx: ExecutionContext): boolean {
        const roles = this.reflector.getAllAndOverride<Role[]>(
            ROLES_KEY,
            [ctx.getHandler(), ctx.getClass()],
        );

        if (!roles) return true;

        const { user } = ctx.switchToHttp().getRequest();
        return roles.includes(user.role);
    }
}
