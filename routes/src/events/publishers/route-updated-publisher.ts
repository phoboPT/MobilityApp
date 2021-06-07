import { Publisher, Subjects, RouteUpdatedEvent } from '@mobileorg/common-lib'

export class RouteUpdatedPublisher extends Publisher<RouteUpdatedEvent>{

    subject: Subjects.RouteUpdated = Subjects.RouteUpdated


}