export enum ROLE_USERS {
    ADMIN = "ADMIN",
    USER = "USER"
}

export interface UserDB {
    id: string,
    nickname: string,
    email: string,
    password: string,
    role:ROLE_USERS,
    created_at: string
}

export interface PostDB {
    id: string,
    creator_id: string,
    content: string,
    likes: number,
    dislikes: number,
    comments: number,
    created_at: string,
    updated_at: string
}

export interface likes_dislikes_PostDB {
    user_id: string,
    post_id: string,
    like: number
}

export interface CommentDB {
    id: string,
    creator_id: string,
    content: string,
    likes: number,
    dislikes: number
    created_at: string,
    updated_at: string,
    post_id: string
}

export interface likes_dislikes_commentDB {
    user_id: string,
    comment_id: string,
    like_comment: number
}
