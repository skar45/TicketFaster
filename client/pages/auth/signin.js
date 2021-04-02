import {useState} from 'react'
import Router from 'next/router'
import useRequest from '../../hooks/use-request'

export default ()=>{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const {doRequest, errors} = useRequest({
        url: '/api/users/signin',
        method: 'post',
        body: {
            email, password
        },
        onSuccess: ()=>Router.push('/')
    })

    const onSubmit = async (event)=>{
        event.preventDefault()
        
        const response = await doRequest()
        response?Router.push('/'):null
        
    }

    return (
        <form onSubmit={onSubmit}>
            <h1>Sign-In</h1>
            <div className="form-group">
                <label>Email Address</label>
                <input value={email} onChange={e=>setEmail(e.target.value)}className="form-control"></input>
            </div>
            <div className="form-group">
                <label>Password</label>
                <input type="password" className="form-control" value={password} onChange={e=>setPassword(e.target.value)}></input>
            </div>
            {errors}
            
            <button className="btn btn-success">Sign-In</button>
        </form>
    ) 
}