import { Publisher, OrderCreatedEvent, Subjects } from '@mobileorg/common-lib';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
