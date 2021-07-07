import { queueGroupName } from './queue-group-name';
import { Listener, OrderCancelledEvent, Subjects } from '@mobileorg/common-lib';
import { Route } from '../../models/route';
import { Message } from 'node-nats-streaming';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        const { id, ticket } = data;
        const route = await Route.findById(ticket.id);
        if (route) {
            route.set({ actualCapacity: route.actualCapacity + 1 });
            await route.save();
        }
        msg.ack();
    }
}
