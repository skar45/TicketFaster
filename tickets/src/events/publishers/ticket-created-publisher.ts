import {Publisher, Subjects, TicketCreatedEvent} from '@ticketfaster/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject: Subjects.TicketCreated = Subjects.TicketCreated
}