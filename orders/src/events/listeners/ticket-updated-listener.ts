import { Message } from 'node-nats-streaming'
import { Listener, Subjects, TicketUpdatedEvent } from '@ticketfaster/common'
import { Ticket } from '../../models/ticket'
import { queueGroupName } from './queue-group-name'

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    subject: TicketUpdatedEvent['subject'] = Subjects.TicketUpdated
    queueGroupName = queueGroupName

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const { title, price } = data
        const ticket = await Ticket.findByEvent(data)
        if(!ticket) throw new Error('Error ticket not found')

        ticket.set({title, price})
        await ticket.save()

        msg.ack()
    }
}