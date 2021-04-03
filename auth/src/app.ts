import express from 'express'
import 'express-async-errors'
import {json} from 'body-parser'

import cookieSession from 'cookie-session'

import {currentUserRouter} from './routes/current-user'
import {signinRouter} from './routes/signin'
import {signupRouter} from './routes/signup'
import {signoutRouter} from './routes/signout'
import {errorHandler} from '@ticketfaster/common'
import {NotFoundError} from '@ticketfaster/common'

const app = express()
app.set('trust proxy', true)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(
    cookieSession({
        signed: false,
        secure: false
    })
)

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signupRouter)
app.use(signoutRouter)
 
app.all('*', ()=>{
    throw new NotFoundError()
})

app.use(errorHandler)

export {app}