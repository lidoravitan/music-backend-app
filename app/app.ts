import cors from 'cors'
import express from 'express'
import { licenseRouter } from './routes/license'
import otpRouter from './routes/otp'
import { usersRouter } from './routes/user'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/users', usersRouter)
app.use('/api/licenses', licenseRouter)
app.use('/api/otp', otpRouter)

export default app
