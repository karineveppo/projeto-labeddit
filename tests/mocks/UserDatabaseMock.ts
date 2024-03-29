import { BaseDatabase } from "../../src/database/BaseDatabase"
import { UserDB, ROLE_USERS } from "../../src/types"

export class UserDatabaseMock extends BaseDatabase {
    public static TABLE_USERS = "users"

    public getAllUsers = async (): Promise<UserDB[]>  => {
        return [
            {
                id: "id-mock",
                nickname: "Normal Mock",
                email: "normal@email.com",
                password: "hash-bananinha",
                created_at: new Date().toISOString(),
                role: ROLE_USERS.USER
            },
            {
                id: "id-mock",
                nickname: "Admin Mock",
                email: "admin@email.com",
                password: "hash-bananinha",
                created_at: new Date().toISOString(),
                role: ROLE_USERS.ADMIN
            }
        ]
    }

    public async signUp(newUser:UserDB){

    }

    public insert = async (userDB: UserDB): Promise<void> => {
        
    }

    public getUserByEmail = async (email: string): Promise<UserDB | undefined>  => {
        switch (email) {
            case "normal@email.com":
                return {
                    id: "id-mock",
                    nickname: "Normal Mock",
                    email: "normal@email.com",
                    password: "hash-bananinha",
                    created_at: expect.any(String),
                    role: ROLE_USERS.USER
                }
            case "admin@email.com":
                return {
                    id: "id-mock",
                    nickname: "Admin Mock",
                    email: "admin@email.com",
                    password: "hash-bananinha",
                    created_at: expect.any(String),
                    role: ROLE_USERS.ADMIN
                }
            default:
                return undefined
        }
    }

    public getUserById = async (id: string):Promise<UserDB | undefined> =>{
        switch (id) {
            case "id-mock":
                return {
                    id: "id-mock",
                    nickname: "Normal Mock",
                    email: "normal@email.com",
                    password: "hash-bananinha",
                    created_at: expect.any(String),
                    role: ROLE_USERS.USER
                }
            case "admin@email.com":
                return {
                    id: "id-mock",
                    nickname: "Admin Mock",
                    email: "admin@email.com",
                    password: "hash-bananinha",
                    created_at: expect.any(String),
                    role: ROLE_USERS.ADMIN
                }
            default:
                return undefined
        }
    }

}
