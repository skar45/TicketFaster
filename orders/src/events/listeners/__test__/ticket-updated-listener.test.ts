import { TicketUpdatedListener } from '../ticket-updated-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../models/ticket'
import mongoose from 'mongoose'
import { TicketUpdatedEvent } from '@ticketfaster/common'

const setup = async ()=> {
    // Create a listener
    const listener = new TicketUpdatedListener(natsWrapper.client)

    // Create and save a ticket
    const ticket = Ticket.build({
        title: 'asdf',
        price: 20,
        id: new mongoose.Types.ObjectId().toHexString()
    })
    await ticket.save()

    // Create a fake data object
    const data: TicketUpdatedEvent['data'] = {
        version: 1,
        id: ticket.id,
        title: 'asdf',
        price: 40,
        userId: 'kyle'
    }

    // Create a fake message object
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    // Return all of this stuff
    return { listener, ticket, data, msg }
}

it('finds, updates and saves a ticket', async ()=> {
    const { listener, ticket, data, msg } = await setup()

    await listener.onMessage(data, msg)

    const updatedTicket = await Ticket.findById(ticket.id)

    expect(updatedTicket!.price).toEqual(data.price)
    expect(updatedTicket!.title).toEqual(data.title)
})

it('acks message', async ()=> {
    const { listener, ticket, data, msg } = await setup()

    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()
})

it('does not call ack if the event has skipped a version number', async ()=> {
    const { listener, ticket, data, msg } = await setup()

    data.version++

    try {
        await listener.onMessage(data,msg)
    } catch (err) {
        return
    }
    expect(msg.ack).not.toHaveBeenCalled()
})