import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { StrategyOptions } from 'passport-jwt';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RefreshPayload, AuthService } from '../auth.service';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
    constructor(private readonly authService: AuthService) {
        const options: StrategyOptions = {
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req) => {
                    let token = null;
                    if (req && req.cookies) {
                        token = req.cookies['refresh_token'];
                    }
                    return token;
                },
            ]),
            secretOrKey: process.env.JWT_REFRESH_SECRET as string,
        };

        super(options);
    }

    async validate(payload: RefreshPayload) {
        const user = await this.authService.verifyUserById(payload.sub);
        if (!user) {
            throw new UnauthorizedException();
        }
        return { ...user, currentSessionId: payload.sessionId };
    }
}
