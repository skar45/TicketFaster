import { Ticket } from "../../../models/ticket"
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCancelledListener } from "../order-cancelled-listener"
import { OrderCancelledEvent } from '@ticketfaster/common'
import mongoose from 'mongoose' 
import { Message } from 'node-nats-streaming'

const setup = async ()=> {
    const listener = new OrderCancelledListener(natsWrapper.client)

    const orderId = mongoose.Types.ObjectId().toHexString()

    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        userId: 'kyle'
    })
    ticket.set({orderId})
    await ticket.save()

    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn() 
    }

    return { listener, orderId, ticket, data, msg }
}

it('updates the ticket, publishes an event and acks a message', async ()=> {
    const { listener, ticket, data, msg } = await setup()
    await listener.onMessage(data,msg)

    const updatedTicket = await Ticket.findById(ticket.id)
    expect(updatedTicket!.orderId).toBeUndefined()
    expect(msg.ack).toHaveBeenCalled()
    expect(natsWrapper.client.publish as jest.Mock).toHaveBeenCalled()
})