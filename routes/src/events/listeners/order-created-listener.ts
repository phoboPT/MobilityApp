import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Listener, OrderCreatedEvent, Subjects } from '@mobileorg/common-lib';
import { Route } from '../../models/route';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const { routeId } = data;
        const route = await Route.findById(routeId);
        if (route) {
            route.set({ actualCapacity: route.actualCapacity - 1 });
            await route.save();
        }
        msg.ack();
    }
}
