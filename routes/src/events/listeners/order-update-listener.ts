import { queueGroupName } from './queue-group-name';
import { Listener, OrderUpdatedEvent, Subjects } from '@mobileorg/common-lib';
import { Route } from '../../models/route';
import { Message } from 'node-nats-streaming';

export class OrderUpdatedListener extends Listener<OrderUpdatedEvent> {
    subject: Subjects.OrderUpdated = Subjects.OrderUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderUpdatedEvent['data'], msg: Message) {
        const { id, routeId } = data;
        // const route = await Route.findById(routeId);
        // if (route) {
        //     route.set({ capacity: route.capacity - 1 });
        //     await route.save();
        // }
        msg.ack();
    }
}
