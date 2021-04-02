import  express, {Request, Response} from 'express'
import {body} from 'express-validator'
import {validateRequest, NotFoundError, requireAuth, NotAuthorizedError, BadRequestError} from '@ticketfaster/common'
import {Ticket} from '../models/ticket'
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.put(
    '/api/tickets/:id', 
    requireAuth,
    [
        body('title')
            .not()
            .isEmpty()
            .withMessage('Title is required'),
        body('price')
            .isFloat({ gt: 0})
            .withMessage('Price must be greater than zero')
    ],
    validateRequest,
    async(req:Request, res:Response)=>{
        const ticket = await Ticket.findById(req.params.id)

        if(!ticket) throw new NotFoundError()

        if(ticket.orderId) throw new BadRequestError('Ticket is reserved')

        if(ticket.userId !== req.currentUser!.id) throw new NotAuthorizedError()

        ticket.set({
            title: req.body.title,
            price: req.body.price
        })

        await ticket.save()

        await new TicketUpdatedPublisher(natsWrapper.client).publish(ticket)

        res.send(ticket)
})

export {router as updateTicketRouter}