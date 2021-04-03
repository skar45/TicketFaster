import mongoose from 'mongoose'
import {app} from './app'

const start = async () => {
    console.log('starting up!!....')

    if(!process.env.JWT_KEY){
        throw new Error('Webtoken is required')
    }

    if(!process.env.MONGO_URI){
        throw new Error('Mongo uri is required')
    }


    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        console.log('connected to mongoDB')
    } catch (err) {
        console.error(err)
    }    
    
    app.listen(3000, ()=>{
        console.log('Listening on port 3000!')
    })

}

start();



