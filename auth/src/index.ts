import mongoose from 'mongoose'
import { app } from './app'

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY not defined')
    }

    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        console.log('Connected to mongo DB')

    } catch (err) {
        console.error(`Error on start ${err}`)
    }
    app.listen(3000, () => {
        console.log('Listening port 3000!!!!!!!!')
    })
}

start()

