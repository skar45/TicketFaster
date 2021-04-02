import useRequest from '../hooks/use-request'
import Link from 'next/link'

const LandingPage = ({currentUser, tickets}) => {

    const showTicket = (id) => {
        //Router.push(`/`)
    }
    
    return (
        <div>
            <h1> Tickets</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.map((ticket)=> {
                        return(
                            <tr key={ticket.id}> 
                                <td>
                                    <Link href='/tickets/[ticketId]' as={`/tickets/${ticket.id}`}>
                                        {ticket.title}
                                    </Link>
                                </td>
                                <td>{ticket.price}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

LandingPage.getInitialProps = async (context, client, currentUser) =>{
    const { data } = await client.get('/api/tickets')

    return { tickets: data }
}

export default LandingPage