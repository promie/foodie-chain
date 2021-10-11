import mongoose from 'mongoose'
import 'dotenv/config'
import { Logger } from '../utils'

const mongoURI = process.env.MONGOURI as string

const Mongoose = () => {
  const initialiseMongoConnection = () => {
    return new Promise((resolve, reject) => {
      mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      })

      const db = mongoose.connection

      db.on('error', (err) => {
        console.error.bind(console, 'connection error:')
        return reject(err)
      })
      db.on('open', () => {
        // we're connected!
        Logger.info('Connected to MongoDB...')
        return resolve(mongoose)
      })
    })
  }

  return { initialiseMongoConnection }
}

export default Mongoose