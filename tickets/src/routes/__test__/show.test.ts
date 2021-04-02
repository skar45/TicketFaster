import {app} from '../../app'
import request from 'supertest'
import mongoose from 'mongoose'

it('returns a 404 if a ticket is not found', async()=>{
    const id = new mongoose.Types.ObjectId().toHexString();
    const response = await request(app)
        .get(`/api/tickets/${id}`)
        .send()
        .expect(404)
    console.log(response.body)
})

it('returns ticket if ticket is found', async () => {
    const title = 'asdf'
    const price = 20

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({title,price})
        .expect(201)
    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
        .expect(200)
    console.log('ticket response: ', ticketResponse.body)
    expect(response.body.title).toEqual(title)
    expect(response.body.price).toEqual(price)
})