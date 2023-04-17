import express from 'express'
import { UserController } from '../controller/UserController'
import { UserBusiness } from '../business/UserBusiness'
import { UserDatabase } from '../database/UserDatabase'
import { IdGenerator } from '../services/IdGenerator'
import { TokenManager } from '../services/TokenManager'
import { HashManager } from '../services/HashManager'
import { UserDTO } from '../dtos/UserDTO'



export const userRouter = express.Router()

const userController = new UserController (
    new UserBusiness(
        new UserDatabase(),
        new IdGenerator(),
        new TokenManager(),
        new HashManager()),
    new UserDTO
)

userRouter.get("/", userController.getAllUsers)
userRouter.post("/signup", userController.signUp)
userRouter.post("/login", userController.login)