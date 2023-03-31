import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserUpdatedEvent } from '../../domain/event/user-update.event';
import { IUserRepository } from '../../domain/repository/iuser.repository';


@EventsHandler(UserUpdatedEvent)
export class UserUpdatedEventHandler implements IEventHandler<UserUpdatedEvent> {
    constructor(
        @Inject('UserRepository') private userRepository: IUserRepository,
    ) { }

    async handle(event: UserUpdatedEvent) {
        switch (event.name) {
            case UserUpdatedEvent.name: {
                const { userId, userName, password } = event as UserUpdatedEvent;
                await this.userRepository.update(userId, userName, password);
                break;
            }
            default:
                break;
        }
    }
}