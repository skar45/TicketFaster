import { PaymentCreatedEvent, Publisher, Subjects } from '@ticketfaster/common'

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: PaymentCreatedEvent['subject'] = Subjects.PaymentCreated
} 