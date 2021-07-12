import { Message } from 'node-nats-streaming';
import { Subjects, Listener, RouteCreatedEvent } from '@mobileorg/common-lib';
import { Route } from '../../models/route';
import { queueGroupName } from './queue-group-name';

export class RouteCreatedListener extends Listener<RouteCreatedEvent> {
    subject: Subjects.RouteCreated = Subjects.RouteCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: RouteCreatedEvent['data'], msg: Message) {
        const { id, capacity } = data;
        const route = Route.build({
            id,         
            capacity,            
        });
        await route.save();

        msg.ack();
    }
}
