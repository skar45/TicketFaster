import { OrderStatus } from '@ticketfaster/common'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'
import { Order } from '../../models/order'
import { stripe } from '../../stripe'
import { Payment } from '../../models/payment'

jest.mock('../../stripe')

it('throws 401 if the user is not logged in', async () => {
   await request(app)
        .post('/api/payments')
        .send({orderId: 'dsaf', token: 'asfaf'})
        .expect(401)
})

it('throws 400 if the body is invalid', async () => {
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({})
        .expect(400)
})

it('throws 404 if the order is not found', async () => {
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({orderId: mongoose.Types.ObjectId().toHexString(), token: 'asfaf'})
        .expect(404)
})

it('throws a 401 if the order does not belong to the user', async () => {
    const user = global.signin()
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 20,
        status: OrderStatus.Created,
        userId: mongoose.Types.ObjectId().toHexString()
    })
    await order.save()

    await request(app)
        .post('/api/payments')
        .set('Cookie', user)
        .send({orderId: order.id, token: 'asdfasdf'})
        .expect(401)
})

it('returns a 400 when purchasing a cancelled order', async () => {
    const user = mongoose.Types.ObjectId().toHexString()
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 20,
        status: OrderStatus.Cancelled,
        userId: user
    })
    await order.save()

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(user))
        .send({orderId: order.id, token: 'asdfasdf'})
        .expect(400)
})

it('returns a 204 with valid inputs', async () => {
    const user = mongoose.Types.ObjectId().toHexString()
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 20,
        status: OrderStatus.Created,
        userId: user
    })
    await order.save()

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(user))
        .send({orderId: order.id, token: 'tok_visa'})
        .expect(204)

    const payment = await Payment.findOne({orderId: order.id})
    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0]
    expect(chargeOptions.source).toEqual('tok_visa')
    expect(chargeOptions.amount).toEqual(20*100)
    expect(chargeOptions.currency).toEqual('cad')
    expect(payment).not.toBeNull()
})