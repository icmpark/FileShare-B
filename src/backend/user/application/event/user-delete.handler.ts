import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserDeletedEvent } from '../../domain/event/user-delete.event';
import { IUserRepository } from '../../domain/repository/iuser.repository';


@EventsHandler(UserDeletedEvent)
export class UserDeletedEventHandler implements IEventHandler<UserDeletedEvent> {
    constructor(
        @Inject('UserRepository') private userRepository: IUserRepository,
    ) { }

    async handle(event: UserDeletedEvent) {
        switch (event.name) {
            case UserDeletedEvent.name: {
                const { userId } = event as UserDeletedEvent;
                await this.userRepository.delete(userId);
                break;
            }
            default:
                break;
        }
    }
}