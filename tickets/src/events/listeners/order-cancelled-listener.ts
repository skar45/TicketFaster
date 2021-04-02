import { Listener, OrderCancelledEvent, Subjects } from '@ticketfaster/common'
import { queueGroupName } from './queue-group-name'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../models/ticket'
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher'

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: OrderCancelledEvent['subject'] = Subjects.OrderCancelled
    queueGroupName = queueGroupName

    async onMessage(data: OrderCancelledEvent['data'], msg:Message){
        const { id, version, ticket } = data

        const updatedTicket = await Ticket.findById(ticket.id)
        if(!updatedTicket) throw new Error ('Ticket not found')
        updatedTicket.set({orderId: undefined})
        await updatedTicket.save()

        await new TicketUpdatedPublisher(this.client).publish(updatedTicket)

        msg.ack()
    }
}