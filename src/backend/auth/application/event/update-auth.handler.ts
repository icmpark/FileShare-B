import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AuthUpdatedEvent } from '../../domain/event/auth-update.event';
import { IAuthRepository } from '../../domain/repository/iauth.repository';

@EventsHandler(AuthUpdatedEvent)
export class AuthUpdatedEventHandler implements IEventHandler<AuthUpdatedEvent> {
    constructor(
        @Inject('AuthRepository') private authRepository: IAuthRepository
    ) { }

    async handle(event: AuthUpdatedEvent) {
        switch (event.name) {
            case AuthUpdatedEvent.name: {
                const { auth } = event as AuthUpdatedEvent;
                await this.authRepository.update(auth);
                break;
            }
            default:
                break;
        }
    }
}