import { CommentDB, likes_dislikes_commentDB, likes_dislikes_PostDB, PostDB } from '../types'
import { BaseDatabase } from './BaseDatabase'
import { UserDatabase } from './UserDatabase'

export class PostDatabase extends BaseDatabase {
    public static POSTS_TABLE = "posts"
    public static COMMENTS_TABLE = "comments"
    public static LIKEDISLIKE_TABLE = "likes_dislikes_posts"
    public static LIKEDISLIKECOMMENT_TABLE = "likes_dislikes_comments"
    public static USERS_TABLE = "users"

    public getAllPosts = async () => {
        const postDB = await BaseDatabase
            .connection(PostDatabase.POSTS_TABLE)
            .select()

        return postDB
    }
    
    public getPostsWithCreator = async () => {
        const postsDB = await this.getAllPosts()
        const creatorsDB = await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .select()

        return {
            postsDB,
            creatorsDB,
        }
    }

    public getPostWithComments = async (id: string) => {
        const postsDB = await BaseDatabase
            .connection(PostDatabase.POSTS_TABLE)
            .select()
            .where({ id: id })

        const creatorsDB = await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .select()

        const commentsDB = await BaseDatabase
            .connection(PostDatabase.COMMENTS_TABLE)
            .select("comments.*", "users.nickname")
            .leftJoin(PostDatabase.USERS_TABLE, "users.id", "=", "comments.creator_id")

        return {
            postsDB,
            creatorsDB,
            commentsDB,
        }
    }

    public getPostById = async (id: string): Promise<PostDB | undefined> => {
        const [postDB]: PostDB[] | undefined = await BaseDatabase
            .connection(PostDatabase.POSTS_TABLE)
            .select()
            .where({ id: id })

        return postDB
    }

    // public getPostByNickname = async (nickname: string): Promise<PostDB | undefined> => {
    //     const [postDB]: PostDB[] | undefined = await BaseDatabase
    //         .connection(PostDatabase.POSTS_TABLE)
    //         .select()
    //         .where({ nickname: nickname })

    //     return postDB
    // }

    public getLikeDislikeByPostId = async (id: string): Promise<likes_dislikes_PostDB[] | undefined> => {
        const likes_dislikes_PostDB: likes_dislikes_PostDB[] | undefined = await BaseDatabase
            .connection(PostDatabase.LIKEDISLIKE_TABLE)
            .select()
            .where({ post_id: id })

        return likes_dislikes_PostDB
    }

    public getCommentsById = async(id: string): Promise<PostDB[] | undefined> => {
        const commentDB: PostDB[] | undefined = await BaseDatabase
        .connection(PostDatabase.COMMENTS_TABLE)
        .select()
        .where({post_id:id})

        return commentDB
    }
    
    public getCommentById = async (id: string): Promise<CommentDB | undefined> => {
        const [commentDB]: CommentDB[] | undefined = await BaseDatabase
        .connection(PostDatabase.COMMENTS_TABLE)
        .select()
        .where({id:id})

        return commentDB
    }

    public getLikeDislikeByCommentId = async (id: string): Promise<likes_dislikes_commentDB[] | undefined> => {
        const likes_dislikes_commentDB: likes_dislikes_commentDB[] | undefined = await BaseDatabase
            .connection(PostDatabase.LIKEDISLIKECOMMENT_TABLE)
            .select()
            .where({ comment_id: id })

        return likes_dislikes_commentDB
    }

    public insertNewPost = async (newPostDB: PostDB) => {
        await BaseDatabase
            .connection(PostDatabase.POSTS_TABLE)
            .insert(newPostDB)
    }

    public insertNewComment = async (newPostDB: CommentDB) => {
        await BaseDatabase
            .connection(PostDatabase.COMMENTS_TABLE)
            .insert(newPostDB)
    }

    public updatePost = async (updatePost: PostDB, id: string) => {
        await BaseDatabase
            .connection(PostDatabase.POSTS_TABLE)
            .update(updatePost)
            .where({ id: id })
    }

    public updateComment = async (updatePost: PostDB, id: string) => {
        await BaseDatabase
            .connection(PostDatabase.COMMENTS_TABLE)
            .update(updatePost)
            .where({ id: id })
    }

    public updateLikeDislike = async (updateLD: likes_dislikes_PostDB) => {
        await BaseDatabase
            .connection(PostDatabase.LIKEDISLIKE_TABLE)
            .insert(updateLD)
    }

    public updateLikeDislikeComment = async (updateLD: likes_dislikes_commentDB) => {
        await BaseDatabase
            .connection(PostDatabase.LIKEDISLIKECOMMENT_TABLE)
            .insert(updateLD)
    }

    public likeDislike = async (user_id: string, post_id: string): Promise<likes_dislikes_PostDB | undefined> => {
        const [likes_dislikes_PostDB]: likes_dislikes_PostDB[] | undefined = 
        await BaseDatabase
            .connection(PostDatabase.LIKEDISLIKE_TABLE)
            .select()
            .where({ user_id: user_id, post_id: post_id })

        return likes_dislikes_PostDB
    }

    public deletePostById = async (id: string) => {
        await BaseDatabase
            .connection(PostDatabase.POSTS_TABLE)
            .del()
            .where({ id: id })
    }

    public deleteCommentsById = async (id: string) => {
        await BaseDatabase
        .connection(PostDatabase.COMMENTS_TABLE)
        .del()
        .where({post_id:id})
    }

    public deleteLikeDislike = async (id: string) => {
        await BaseDatabase
        .connection(PostDatabase.LIKEDISLIKE_TABLE)
        .del()
        .where({post_id:id})
    }

    public deleteLikeDislikeComments = async (id: string) => {
        await BaseDatabase
        .connection(PostDatabase.LIKEDISLIKE_TABLE)
        .del()
        .where({comment_id:id})
    }
}












