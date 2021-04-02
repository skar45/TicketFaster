import { OrderCancelledListener } from '../order-cancelled-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { Message } from 'node-nats-streaming'
import { OrderCancelledEvent, OrderStatus } from '@ticketfaster/common'
import mongoose from 'mongoose'
import { Order } from '../../../models/order'

const setup = async ()=> {
    const listener = new OrderCancelledListener(natsWrapper.client)

    const data: OrderCancelledEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: 1,
        ticket: {
            id: mongoose.Types.ObjectId().toHexString()
        }
    }

    const order = Order.build({
        id: data.id,
        version: data.version -1,
        price: 20,
        userId: 'afadaf',
        status: OrderStatus.Created
    })
    await order.save()

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, order, msg}
}

it('cancels the order and acks the msg', async ()=> {
    const { listener, data, order, msg } = await setup()
    await listener.onMessage(data,msg)
    const updatedOrder = await Order.findById(order.id)

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
    expect(msg.ack).toHaveBeenCalled()
})