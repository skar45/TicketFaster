import { Publisher, ExpirationCompleteEvent, Subjects } from '@ticketfaster/common'

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: ExpirationCompleteEvent['subject'] = Subjects.ExpirationComplete
}