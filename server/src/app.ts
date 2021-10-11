import express, { Application } from 'express'
import cors from 'cors'
import { Logger } from './utils'
import Mongoose from './config/db'
import {
  DocumentRoute,
  ParticipantRoute,
  TraceRoute,
  ProductRoute,
} from './routes'

const app: Application = express()

app.use(express.json())
app.use(cors())

app.use('/api/v1/participants', ParticipantRoute)
app.use('/api/v1/track', TraceRoute)
app.use('/api/v1/documents', DocumentRoute)
app.use('/api/v1/products', ProductRoute)

const PORT = process.env.PORT || 5000

const startServer = async (): Promise<void> => {
  await Mongoose().initialiseMongoConnection()
  app.listen(PORT, () => {
    Logger.info(`Server is running on port ${PORT}`)
  })
}

startServer()
