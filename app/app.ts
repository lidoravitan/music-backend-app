import cors from 'cors'
import express from 'express'
import otpRouter from './routes/otp'
import { seatsRouter } from './routes/seats'
import { usersRouter } from './routes/user'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/users', usersRouter)
app.use('/api/seats', seatsRouter)
app.use('/api/otp', otpRouter)

export default app
