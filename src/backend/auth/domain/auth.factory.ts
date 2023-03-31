import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { AuthUpdatedEvent } from './event/auth-update.event';
import { Auth } from './auth';

@Injectable()
export class AuthFactory {
    constructor(private eventBus: EventBus) { }

    async update(
        userId: string,
        refreshToken: string
    ): Promise<Auth> {

        const auth = this.reconstitute(userId, refreshToken);
        const event = new AuthUpdatedEvent(auth);
        await this.eventBus.publish(event);
        return this.reconstitute(userId, refreshToken);
    }

    reconstitute(
        userId: string,
        refreshToken: string
    ): Auth {
        return new Auth(userId, refreshToken);
    }
}