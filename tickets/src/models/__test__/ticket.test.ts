import { Ticket } from '../ticket'

it('implements optimistic concurrency control', async (done)=>{
    // create an instance of ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        userId: 'dsdf'
    })

    // save the ticket to the database
    await ticket.save()

    // fetch the ticket twice
    const firstInstance = await Ticket.findById(ticket.id)
    const secondInstance = await Ticket.findById(ticket.id)

    // make two seperate changes to the tickets we fetched
    firstInstance!.set({ price: 30 })
    secondInstance!.set({ price: 15 })

    //save the first fetched ticket
    await firstInstance!.save()

    // save the second fetched ticket and expect an error
    try {
        await secondInstance!.save()
    } catch (err) {
        return done()
    }

    throw new Error('Should not reach this point')
})

it('increments the version number on multiple saves', async ()=> {
    const ticket = Ticket.build({
        title: 'concert',
        price: 30,
        userId: 'asd'
    })
    await ticket.save()
    expect(ticket.version).toEqual(0)

    const firstInstance = await Ticket.findById(ticket.id)
    firstInstance!.set({price: 20})
    await firstInstance!.save()

    expect(firstInstance!.version).toEqual(1)
})