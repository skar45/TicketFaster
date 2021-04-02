import nats from 'node-nats-streaming'
import { TicketCreatedPublisher } from './events/ticket-created-publisher'

console.clear()

const client = nats.connect('ticketing', 'abc', {url: "http://localhost:4222"})

client.on('connect', async()=>{
    console.log('Publisher connected to NATS')

    const publisher = new TicketCreatedPublisher(client)
    try {
        await publisher.publish({id:'adsf', title: 'sdaf', price:20})
    } catch(err) {
        throw err
    }
    // const data = JSON.stringify({
    //     id: 42,
    //     title: 'meaning of life',
    //     price: 3.50
    // })

    // client.publish('ticket:created', data, ()=>{
    //     console.log('Event Published')
    // })
})