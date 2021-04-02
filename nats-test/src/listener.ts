import nats from 'node-nats-streaming'
import {ticketCreatedListener} from './events/ticket-created-listener'
import {randomBytes} from 'crypto'

console.clear()

const client = nats.connect('ticketing', randomBytes(4).toString('hex'), {url: 'http://localhost:4222'})

client.on('connect', ()=>{
    console.log('listener connected to NATS')

    client.on('close', ()=>{
        console.log('NATS connection closed')
        process.exit()
    })
    
    new ticketCreatedListener(client).listen()
})

process.on('SIGINT', ()=> client.close())
process.on('SIGTERM', ()=> client.close())


