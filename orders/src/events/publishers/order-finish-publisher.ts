import { Publisher, OrderFinishEvent, Subjects } from '@mobileorg/common-lib';

export class OrderFinishPublisher extends Publisher<OrderFinishEvent> {
    subject: Subjects.OrderFinish = Subjects.OrderFinish;
}
