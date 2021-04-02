import { ExpirationCompleteListener } from '../expiration-complete-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { ExpirationCompleteEvent, OrderStatus } from '@ticketfaster/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../models/ticket'
import { Order } from '../../../models/order'

const setup = async ()=> {
    const listener = new ExpirationCompleteListener(natsWrapper.client)

    const ticket = Ticket.build({
        title: 'adsf',
        price: 23,
        id: mongoose.Types.ObjectId().toHexString()
    })
    await ticket.save()

    const order = Order.build({
        userId: 'kyle',
        status: OrderStatus.Created,
        expiresAt: new Date(),
        ticket
    })
    await order.save()

    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id
    }
    
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg, order }
}

it('updates the order status to cancelled', async ()=> {
    const { listener, data, msg, order} = await setup()
    await listener.onMessage(data, msg)
    const updatedOrder = await Order.findById(data.orderId)

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('publishes an order cancelled event', async ()=> {
    const { listener, data, msg, order} = await setup()
    await listener.onMessage(data, msg)

    expect(natsWrapper.client.publish).toHaveBeenCalled()

    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])

    expect(eventData.id).toEqual(data.orderId)
})

it('acks the message', async ()=> {
    const { listener, data, msg, order} = await setup()
    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()
})