import cors from 'cors'
import express from 'express'
import { licenseRouter } from './routes/license'
import { usersRouter } from './routes/user'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/users', usersRouter)
app.use('/api/licenses', licenseRouter)

export default app
