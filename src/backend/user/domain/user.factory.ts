import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { UserCreatedEvent } from './event/user-create.event';
import { UserUpdatedEvent } from './event/user-update.event';
import { UserDeletedEvent } from './event/user-delete.event';
import { User } from './user';

@Injectable()
export class UserFactory {
    constructor(private eventBus: EventBus) { }

    create(
        userId: string,
        userName: string,
        password: string,
    ): User {
        const user = new User(userId, userName, password);
        this.eventBus.publish(new UserCreatedEvent(user));
        return user;
    }

    update(
        userId: string,
        userName?: string,
        password?: string
    ): void {
        const event = new UserUpdatedEvent(userId, userName, password);
        this.eventBus.publish(event);
    }

    delete(userId: string): void {
        const event = new UserDeletedEvent(userId);
        this.eventBus.publish(event);
    }


    reconstitute(
        userId: string,
        name: string,
        password: string,
    ): User {
        return new User(userId, name, password);
    }
}