import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { userRouter } from './router/userRouter'
import { postRouter } from './router/postRouter'

dotenv.config()

const app = express()
const local = process.env.PORT

app.use(cors())
app.use(express.json())

app.listen(local, () => {
    console.log(`Servidor rodando na porta ${local}`)
})

app.use("/users", userRouter)
app.use("/posts", postRouter)

