import { Publisher, Subjects, VehiculeUpdatedEvent } from '@mobileorg/common-lib';

export class VehiculeUpdatedPublisher extends Publisher<VehiculeUpdatedEvent> {
    subject: Subjects.VehiculeUpdated = Subjects.VehiculeUpdated;
}
