import { OrderCreatedEvent, OrderStatus } from '@ticketfaster/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { OrderCreatedListener } from '../order-created-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { Order } from '../../../models/order'

const setup = () => {

    const data: OrderCreatedEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: 'dasf',
        expiresAt: 'adsf',
        ticket: {
            id: mongoose.Types.ObjectId().toHexString(),
            price: 15
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { data, msg}
}

it( 'saves the order and acks the message', async () => {
    const { data, msg } = await setup()
    await new OrderCreatedListener(natsWrapper.client).onMessage(data,msg)  

    const eventData = (natsWrapper.client.publish as jest.Mock).mock.calls
    const order = await Order.findById(data.id)

    console.log(eventData)
    expect(order).toBeDefined()
    // expect(eventData.id).toEqual(data.id)
    expect(msg.ack).toHaveBeenCalled()
})