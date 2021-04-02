import { Publisher, OrderCancelledEvent, Subjects } from '@ticketfaster/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}