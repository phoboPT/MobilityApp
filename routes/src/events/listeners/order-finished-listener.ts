import { queueGroupName } from './queue-group-name';
import { Listener, OrderFinishEvent, Subjects } from '@mobileorg/common-lib';
import { Route } from '../../models/route';
import { Message } from 'node-nats-streaming';

export class OrderFinishedListener extends Listener<OrderFinishEvent> {
    subject: Subjects.OrderFinish = Subjects.OrderFinish;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderFinishEvent['data'], msg: Message) {
        const { id, route } = data;
        const routes = await Route.findById(route.id);
        if (routes) {
            routes.set({ actualCapacity: routes.capacity });
            await routes.save();
        }
        msg.ack();
    }
}
