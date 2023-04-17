export interface GetAllUsersInputDTO {
    q: string,
    token: string
}

export interface SignUpDTO {
    nickname: string,
    email: string,
    password: string
}

export interface LoginDTO {
    email: string,
    password: string
}

export class UserDTO {
    getAllUsersInput = (q: string, token: string): GetAllUsersInputDTO => {
        const result: GetAllUsersInputDTO = {
            q,
            token
        }
        return result
    }

    signup = (nickname: string, email: string, password: string): SignUpDTO => {
        const result: SignUpDTO = {
            nickname,
            email,
            password
        }
        return result
    }

    login = (email: string, password: string): LoginDTO => {
        const result: LoginDTO = {
            email,
            password
        }
        return result
    }
}