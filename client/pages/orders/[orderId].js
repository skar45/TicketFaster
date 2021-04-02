import { useEffect, useState } from 'react'
import StripeCheckout from 'react-stripe-checkout'
import useRequest from '../../hooks/use-request'
import Router from 'next/router'

const OrderShow = ({ order, currentUser }) => {
    const stripeKey = 'pk_test_51Ib8bCDRIyOVCuu12rUHfgEHFu01HqimctvwenEs6Dt7L2ksfuenj3xzbs3LwdzIG6z2qJXbLvh9Is0alD2WdiuE00hcYNV1n8'
    const [timeLeft, setTimeLeft] = useState(0)
    
    const sendToken = async (token) => {
        const {doRequest, errors} = useRequest({
            url: '/api/payments',
            method: 'post',
            body: {
                token: token,
                orderId: order.id
            },
            onSuccess: () => Router.push('/orders') 
        })

        await doRequest()
        if(errors) console.log(errors)
    }
   

    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date()
            setTimeLeft(Math.round(msLeft/1000))
        }
        findTimeLeft()
        const timerId = setInterval(findTimeLeft, 1000)

        return () => {
            clearInterval(timerId)
        }

    }, []) 

    if (timeLeft< 0) return <div>Order has expired</div>    

    return (
        <div>
            {timeLeft} seconds until the order expires
            <StripeCheckout
                token={({id}) => sendToken(id)}
                email={currentUser.email}
                amount={order.ticket.price*100} 
                stripeKey={stripeKey}
            >
            </StripeCheckout>
        </div>
    )
}

OrderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query
    const { data } = await client.get(`/api/orders/${orderId}`)

    return { order: data }
}

export default OrderShow