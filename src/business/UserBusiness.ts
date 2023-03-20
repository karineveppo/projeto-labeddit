import { UserDatabase } from '../database/UserDatabase'
import { User } from '../models/User'
import { TokenPayLoad, ROLE_USERS, UserDB } from '../types'
import { SignupDTO, LoginDTO,GetAllUsersInputDTO } from '../dtos/UserDTO'
import { HashManager } from '../services/HashManager'
import { BadRequestError } from '../errors/BadRequestError'
import { NotFoundError } from '../errors/NotFoundError'
import { IdGenerator } from '../services/IdGenerator'
import { TokenManager } from '../services/TokenManager'


export class UserBusiness {
    constructor(
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private hashManager: HashManager
    ) {}

    public async getAllUsers(input: GetAllUsersInputDTO) {
        const {q, token} = input

        if(typeof token !== "string") {
            throw new BadRequestError("Hum...'Token' não existente!")
        }

        const payload = this.tokenManager.getPayload(token)

        if(payload === null) {
            throw new BadRequestError("'Token' inválido!")
        }

        if(payload.role !== ROLE_USERS.ADMIN) {
            throw new BadRequestError("Somente Administrador!")
        }

        console.log(payload)

        const usersDB = await this.userDatabase.getAllUsers()

        const users = usersDB.map((userDB: { id: string; nickname: string; email: string; password: string; role: ROLE_USERS; created_at: string }) => {
            const user = new User(
                userDB.id,
                userDB.nickname,
                userDB.email,
                userDB.password,
                userDB.role,
                userDB.created_at,
            )
            return user.toDBModel()
        })
        return users
    }

    public async signup(input: SignupDTO) {
        const { nickname, email, password } = input

        const id = this.idGenerator.generate()

        const passwordHash = await this.hashManager.hash(password)

        const created_at = (new Date()).toISOString()

        const filterUserByEmail = await this.userDatabase.getUserByEmail(email)

        if(filterUserByEmail) {
            throw new BadRequestError("'Email já cadastrado!")
        }

        if(typeof nickname !== "string") {
            throw new BadRequestError("'Nickname' deve ser uma string!")
        }

        if(typeof email !== "string") {
            throw new BadRequestError("'Email' deve ser uma string!")
        }

        if(typeof password !== "string") {
            throw new BadRequestError("'Password deve ser uma string!")
        }

        const newUser = new User(
            id,
            nickname,
            email,
            passwordHash,
            ROLE_USERS.USER,
            created_at
        )

        const tokenPayLoad: TokenPayLoad = {
            id: newUser.getId(),
            nickname: newUser.getNickname(),
            role: newUser.getRole()
        }
        
        const token = this.tokenManager.createToken(tokenPayLoad)

        const newUserDB = newUser.toDBModel()
        
        await this.userDatabase.signup(newUserDB)

        const output = {
            message: "Usuário cadastrado com sucesso!",
            token
        }
        return output
    }

    public async login(input: LoginDTO) {
        const {email, password } = input

        if(typeof email !== "string") {
            throw new BadRequestError(" O 'email' deve ser uma string!")
        }

        if(password === undefined) {
            throw new BadRequestError("O 'password' está incorreto!")
        }

        const passwordHash = await this.hashManager.compare (password, searchUserByLogin.password)
        
        if(!passwordHash) {
            console.log("conta", searcheUserByLigin.password)
            console.log("senha", password)
            console.log("Hash", passwordHash)
            throw new BadRequestError("O 'email' e/ou a 'senha' estão incorretos!")
        }

        if(searcheUserByLogin) {

            const userLogin = new User (
                searchUserByLogin.id,
                searchUserByLogin.nickname,
                searchUserByLogin.email,
                searchUserByLogin.password,
                searchUserByLogin.role,
                searchUserByLogin.created_at
            )

            const tokenPayload: TokenPayload = {
                id: userLogin.getId(),
                nickname: userLogin.getNickname(),
                role: userLogin.getRole()
            }

            const token = this.tokenManager.createToken(tokenPayload)

            const output = { message: "Login realizado com sucesso!", token }
            return output
        } else {
            const output = { message: "Login incorreto!", token: '' }
            return output
        }
    }
}