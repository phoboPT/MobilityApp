import { queueGroupName } from './queue-group-name';
import { Listener, OrderFinishEvent, Subjects } from '@mobileorg/common-lib';
import { Route } from '../../models/route';
import { Message } from 'node-nats-streaming';

export class OrderFinishedListener extends Listener<OrderFinishEvent> {
    subject: Subjects.OrderFinish = Subjects.OrderFinish;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderFinishEvent['data'], msg: Message) {
        const { id, ticket } = data;
        console.log('message', data);
        const route = await Route.findById(ticket.id);
        if (route) {
            route.set({ actualCapacity: route.capacity });
            await route.save();
        }
        msg.ack();
    }
}
