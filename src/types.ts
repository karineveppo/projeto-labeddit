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
    created_at: string,
}

export interface PostDB {
    id: string,
    creator_id: string,
    content: string,
    comments: number,
    likes: number,
    dislikes: number,
    created_at: string,
    updated_at: string,
}

export interface likes_dislikes_PostDB {
    user_id: string,
    post_id: string,
    like: number,
}

export interface CommentDB {
    id: string,
    creator_id: string,
    content: string,
    likes: number,
    dislikes: number
    created_at: string,
    updated_at: string,
    post_id: string,
}

export interface CommentsWhithCreatorDB {
    id: string,
    content: string,
    likes: number,
    dislikes: number,
    created_at: string,
    updated_at: string,
    post_id: string,
    creator: {
        creator_id: string,
        nickname: string,
    }
}

export interface PostByUsersDB {
    id: string,
    content: string,
    comments: number,
    likes: number,
    dislikes: number,
    created_at: string,
    updated_at: string,
    creator: {
        id: string,
        nickname: string,
    }
}

export interface PostWithCommentsDB {
    id: string,
    content: string,
    comments: number,
    likes: number,
    dislikes: number,
    created_at: string,
    updated_at: string,
    creator: {
        id: string,
        nickname: string,
    },
    comments_post: CommentsWhithCreatorDB,
}

export interface likes_dislikes_commentDB {
    user_id: string,
    comment_id: string,
    like: number,
}

export interface TokenPayLoad {
    id: string,
    nickname: string,
    role: ROLE_USERS
}
