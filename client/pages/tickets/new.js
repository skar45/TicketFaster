import { useState } from 'react'
import Router from 'next/router'
import useRequest from '../../hooks/use-request'

const NewTicket = () => {
    const [title, setTitle] = useState('')
    const [price, setPrice] = useState('')
    const { doRequest, errors } = useRequest({
        url: '/api/tickets',
        method: 'post',
        body: {
            title, 
            price
        },
        onSuccess: () => Router.push('/')
    })

    const onBlur = () => {
        const value = parseFloat(price).toFixed(2)
        if (isNaN(value)) return
        setPrice(value)
    }

    const onSubmit = (event) => {
        event.preventDefault()
        doRequest()
    }

    return (
        <div>
            <h1>create a ticket</h1>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    <input value={title} onChange={(e)=>setTitle(e.target.value)} className="form-control"/>
                </div>
                <div className="form-group">
                    <label>Price</label>
                    <input value={price} onBlur={onBlur} onChange={(e)=>setPrice(e.target.value)}className="form-control"/>
                </div>
                <button className="btn btn-primary">Submit</button>
                {errors}
            </form>
        </div>
    )
}

export default NewTicket