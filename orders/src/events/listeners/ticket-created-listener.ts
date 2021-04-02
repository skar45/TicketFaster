import { Message } from 'node-nats-streaming'
import { Listener, Subjects, TicketCreatedEvent } from '@ticketfaster/common'
import { Ticket } from '../../models/ticket'
import { queueGroupName } from './queue-group-name'

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: TicketCreatedEvent['subject'] = Subjects.TicketCreated
    queueGroupName = queueGroupName

    async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        const { title, price, id } = data
        const ticket = Ticket.build({title: title, price: price, id: id})

        await ticket.save()

        msg.ack()
    }
}