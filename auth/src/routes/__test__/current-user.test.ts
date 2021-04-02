import request from 'supertest'
import {app} from '../../app'


it('responds with the details about the current user', async()=>{
    const cookie = await global.signin()
    const response = await request(app)
        .get('/api/users/currentuser')
        .set('Cookie', cookie)
        .send()
        .expect(200)
    console.log(response.get('Set-Cookie'))
})

it('responds with null user', async()=>{
    const response = await request(app)
        .get('/api/users/currentuser')
        .send()
        .expect(200)
    expect(response.body.currentUser).toEqual(null)
})