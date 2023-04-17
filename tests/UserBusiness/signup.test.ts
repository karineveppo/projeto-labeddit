import { UserBusiness } from "../../src/business/UserBusiness"
import { SignUpDTO } from "../../src/dtos/UserDTO"
import { HashManagerMock } from "../mocks/HashManagerMock"
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../mocks/UserDatabaseMock"

describe("signup", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )
    
    test("cadastro bem-sucedido retorna token", async () => {
        const input: SignUpDTO = {
            email: "example@email.com",
            nickname: "Example Mock",
            password: "bananinha"
        }

        const response = await userBusiness.signup(input)
        expect(response.token).toBe("token-mock-normal")
    })

    test("Deve retornar um erro caso o e-mail já esteja cadastrado", ()=>{
        const input: SignUpDTO = {
            email: "normal@email.com",
            nickname: "Example Mock",
            password: "bananinha"
        }

        expect(async()=>{
            await userBusiness.signup(input)
        }).rejects.toThrow("'Email' já cadastrado!")
    })
})