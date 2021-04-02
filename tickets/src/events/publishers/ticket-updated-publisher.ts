import {Publisher, Subjects, TicketUpdatedEvent} from '@ticketfaster/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}