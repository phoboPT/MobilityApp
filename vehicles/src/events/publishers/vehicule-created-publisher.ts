import { Publisher, Subjects, VehiculeCreatedEvent } from '@mobileorg/common-lib';

export class VehiculeCreatedPublisher extends Publisher<VehiculeCreatedEvent> {
    subject: Subjects.VehiculeCreated = Subjects.VehiculeCreated;
}
