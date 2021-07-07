import { Publisher, Subjects, OrderCancelledEvent } from '@mobileorg/common-lib';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
