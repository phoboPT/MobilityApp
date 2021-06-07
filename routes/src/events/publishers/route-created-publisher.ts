import { Publisher, Subjects, RouteCreatedEvent } from '@mobileorg/common-lib'

export class RouteCreatedPublisher extends Publisher<RouteCreatedEvent>{

    subject: Subjects.RouteCreated = Subjects.RouteCreated


}