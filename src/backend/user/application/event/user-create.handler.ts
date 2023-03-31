import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserCreatedEvent } from '../../domain/event/user-create.event';
import { IUserRepository } from '../../domain/repository/iuser.repository';


@EventsHandler(UserCreatedEvent)
export class UserCreatedEventHandler implements IEventHandler<UserCreatedEvent> {
    constructor(
        @Inject('UserRepository') private userRepository: IUserRepository,
    ) { }

    async handle(event: UserCreatedEvent) {
        switch (event.name) {
            case UserCreatedEvent.name: {
                const { user } = event as UserCreatedEvent;
                await this.userRepository.create(user);
                break;
            }
            default:
                break;
        }
    }
}