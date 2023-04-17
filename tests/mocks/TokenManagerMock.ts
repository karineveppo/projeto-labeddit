import { TokenPayLoad, ROLE_USERS } from "../../src/types"

export class TokenManagerMock {

    public createToken = (payload: TokenPayLoad): string => {
        if (payload.role == ROLE_USERS.USER) {
            return "token-mock-normal"
        } else {
            return "token-mock-normal"
        }
    }

    public getPayload = (token: string): TokenPayLoad | null => {
        if (token == "token-mock-normal") {
            return {
                id: "id-mock",
                nickname: "name-mock",
                role: ROLE_USERS.USER
            }
            
        } else if (token == "token-mock-admin") {
            return {
                id: "id-mock",
                nickname: "name-mock",
                role: ROLE_USERS.ADMIN
            }

        } else {
            return null
        }
    }
}