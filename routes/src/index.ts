import mongoose from 'mongoose'
import { app } from './app'
import { natsWrapper } from './nats-wrapper'

const start = async () => {

    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI not defined')
    }

    try {
        await natsWrapper.connect("route", "asdasd", "http://nats-srv:4222")
        natsWrapper.client.on('close', () => {
            console.log("NATS connection closed")
            process.exit()
        })
        process.on('SIGINT', () => natsWrapper.client.close())
        process.on('SIGTERM', () => natsWrapper.client.close())

        await mongoose.connect(process.env.MONGO_URI, {
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
