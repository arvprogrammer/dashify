import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AccessPayload, AuthService } from '../auth.service';
import { SessionService } from '../session.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private readonly authService: AuthService,
        private readonly sessionService: SessionService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request) => {
                    return (
                        request.cookies?.access_token
                    );
                },
            ]),
            secretOrKey: process.env.JWT_ACCESS_SECRET as string,
        });
    }

    async validate(payload: AccessPayload) {
        // verify session is valid
        const session = await this.sessionService.getSession(payload.sub, payload.sessionId);
        if (!session || session.isRevoked || session.expiresAt < new Date()) {
            throw new UnauthorizedException();
        }

        // verify user still exists and is active
        const user = await this.authService.verifyUserById(payload.sub);
        if (!user || !user.isActive) {
            throw new UnauthorizedException();
        }
        
        return { ...user, currentSessionId: payload.sessionId };
    }
}
