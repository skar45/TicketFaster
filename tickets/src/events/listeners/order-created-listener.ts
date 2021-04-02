import { Listener, NotFoundError, OrderCreatedEvent, Subjects } from '@ticketfaster/common'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../models/ticket'
import { queueGroupName } from './queue-group-name'
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: OrderCreatedEvent['subject'] = Subjects.OrderCreated
    queueGroupName = queueGroupName

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const { id, ticket, status } = data
        const reservationTicket = await Ticket.findById(ticket.id)

        if(!reservationTicket) throw new NotFoundError()

        reservationTicket.set({orderId: id})
        await reservationTicket.save()

        await new TicketUpdatedPublisher(this.client).publish(reservationTicket)
        msg.ack()
    }
}