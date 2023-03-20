import { UserDB, ROLE_USERS } from '../types'


export class User {
    constructor(
        private id: string,
        private nickname: string,
        private email: string,
        private password: string,
        private role: ROLE_USERS,
        private created_at: string,
    ) {}

    public toDBModel(): UserDB {
        return{
            id: this.id,
            nickname: this.nickname,
            email: this.email,
            password: this.password,
            role: this.role,
            created_at: this.created_at,
        }
    }

    public getId(): string {
        return this.id
    }

    public setId(value: string): void {
        this.id = value
    } 

    public getNickname(): string {
        return this.nickname
    }

    public setNickname(value: string): void {
        this.nickname = value
    }

    public getEmail(): string {
        return this.email
    }

    public setEmail(value: string): void {
        this.email = value
    }

    public getPassword(): string {
        return this.password
    }

    public setPassword(value: string): void {
        this.password = value
    }

    public getRole(): ROLE_USERS {
        return this.role
    }

    public setRole(value: ROLE_USERS): void {
        this.role = value
    }

    public getCreatedAt(): string {
        return this.created_at
    }

    public setCreatedAt(value: string): void {
        this.created_at = value
    }
}