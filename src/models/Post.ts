import { CommentDB, CommentsWhithCreatorDB, likes_dislikes_PostDB, PostByUsersDB, PostDB, PostWithCommentsDB } from '../types'

export class Post {
    constructor(
        private id: string,
        private content: string,
        private comments: number,
        private likes: number,
        private dislikes: number,
        private created_at: string,
        private updated_at: string,
        private creator: {
            id: string,
            nickname: string
        },
        private comments_post: CommentsWhithCreatorDB
        
    ) {}

    public toDBModel(): PostDB {
        return {
            id: this.id,
            creator_id: this.creator.id,
            comments: this.comments,
            content: this.content,
            likes: this.likes,
            dislikes: this.dislikes,
            created_at: this.created_at,
            updated_at: this.updated_at

        }
    }

    public toDBCommentModel(): CommentDB {
        return {
            id:this.id,
            creator_id: this.creator.id,
            post_id: this.comments_post.post_id,
            content: this.content,
            likes: this.likes,
            dislikes: this.dislikes,
            created_at: this.created_at,
            updated_at: this.updated_at
        }
    }

    public toBusinessModel(): PostByUsersDB {
        return {
            id: this.id,
            content: this.content,
            comments: this.comments,
            likes: this.likes,
            dislikes: this.dislikes,
            created_at: this.created_at,
            updated_at: this.updated_at,
            creator: this.creator
        }
    }

    public toDBLikeDislikeModel():likes_dislikes_PostDB {
        return{
            post_id: this.id,
            user_id: this.creator.id,
            like: this.likes,
        }
    }

    public toBusinessCommentsModel():PostWithCommentsDB {
        return{
            id: this.id,
            content: this.content,
            comments: this.comments,
            likes: this.likes,
            dislikes: this.dislikes,
            created_at: this.created_at,
            updated_at: this.updated_at,
            creator: this.creator,
            comments_post: this.comments_post          
        }
    }

    public getId():string{
        return this.id
    }

    public setId(value:string){
        this.id = value
    }

    public getContent():string{
        return this.content
    }

    public setContent(value:string){
        this.content = value
    }

    public getComments():number{
        return this.comments
    }

    public setComments(value:number){
        this.comments = value
    }

    public getLikes():number{
        return this.likes
    }

    public setLikes(value:number){
        this.likes = value
    }

    public getDislikes():number{
        return this.dislikes
    }

    public setDislikes(value:number){
        this.dislikes = value
    }

    public getCreatedAt():string{
        return this.created_at
    }

    public setCreatedAt(value:string){
        this.created_at = value
    }

    public getUpdatedAt():string{
        return this.updated_at
    }

    public setUpdatedAt(value:string){
        this.updated_at = value
    }

    public getCreator():{
        id: string,
        nickname: string,
    }{
        return this.creator
    }

    public setCreator(value:{
        id: string,
        nickname: string,
    }){
        this.creator = value
    }
}