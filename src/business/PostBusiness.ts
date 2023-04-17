import { PostDatabase } from "../database/PostDatabase"
import { UserDatabase } from "../database/UserDatabase"
import { ROLE_USERS } from "../types"
import { BadRequestError } from "../errors/BadRequestError"
import { Post } from "../models/Post"
import { InsertInputPostDTO, InsertInputCommentDTO, UpdateInputDTO, LikeDislikeDTO, GetAllPostsInputDTO, GetPostInputDTO, DeleteInputPostDTO } from "../dtos/PostDTO"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"


export class PostBusiness {
    static deletePost(input: { id: string; token: string }) {
        throw new Error('Publicação não encontrada!')
    }
    constructor(
        private postDatabase: PostDatabase,
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ) {}

    public getAllPosts = async (input: GetAllPostsInputDTO) => {
        const { q, token } = input

        if(typeof token !== "string") {
            throw new BadRequestError("'Token' não informado!")
        }

        const payload = this.tokenManager.getPayload(token)

        if(payload === null) {
            throw new BadRequestError("'Token' inválido!")
        }

        const { postsDB, creatorsDB } = await this.postDatabase.getPostsWithCreator()

        const posts = postsDB.map((postDB) => {
            const post = new Post(
                postDB.id,
                postDB.content,
                postDB.comments,
                postDB.likes,
                postDB.dislikes,
                postDB.created_at,
                postDB.updated_at,
                getCreator(postDB.creator_id),
                postDB.comments_post,
            )
            return post.toBusinessModel()
        })

        function getCreator(creatorId: string) {
            const creator = creatorsDB.find((creatorDB) => {
                return creatorDB.id === creatorId
            })
            return {
                id: creator.id,
                nickname: creator.nickname
            }
        }
        return posts
    }

    public getPostsById = async (input: GetPostInputDTO) => {
        const {id, token} = input

        if(typeof token !== "string"){
            throw new BadRequestError("'Token' não informado!")
        }

        const payload = this.tokenManager.getPayload(token)

        if(payload === null){
            throw new BadRequestError("'Token' inválido!")
        }

        const filterPostById = await this.postDatabase.getPostById(id)

        if(!filterPostById){
            throw new BadRequestError("'Post' não localizado!")
        }
            
        const {
            postsDB,
            creatorsDB,
            commentsDB
        } = await this.postDatabase.getPostWithComments(id)

        const posts = postsDB.map((postDB)=>{
            const post = new Post (
                postDB.id,
                postDB.content,
                postDB.comments,
                postDB.likes,
                postDB.dislikes,
                postDB.created_at,
                postDB.updated_at,
                getCreator(postDB.creator_id),
                getComments(postDB.id)
                )

                return post.toBusinessCommentsModel()
        })

        function getCreator(creatorId: string){
            const creator = creatorsDB.find((creatorDB)=>{
                return creatorDB.id === creatorId
            })

            return{
                id: creator.id,
                nickname: creator.nickname
            }
        }

        function getComments(postId: string): any {
            const comments = commentsDB.filter((commentDB)=>{
                return commentDB.post_id === postId
            })

            return comments
        }

        return posts  
    }

    public insertNewPost = async(input: InsertInputPostDTO) => {

        const {content, token} = input

        if(typeof token !== "string"){
            throw new BadRequestError("'Token' não informado!")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null){
            throw new BadRequestError("'Token' inválido!")
        }

        const id = this.idGenerator.generate()
        const created_at = (new Date()).toISOString()
        const updated_at = (new Date()).toISOString()
        const comments = 0
        const likes = 0
        const dislikes = 0
        const creator_id = payload.id
        

        if(content !== undefined){
            if(typeof content !== "string"){
                throw new BadRequestError("'content' precisa ser uma string!")
            }
        }else{
            throw new BadRequestError("Por favor, informar o 'content'!")
        }

        const newPost = new Post (
            id,
            content,
            comments,
            likes,
            dislikes,
            created_at,
            updated_at,
            {id:creator_id,
            nickname: payload.nickname,},
            {id: '',
            content: '',
            likes: 0,
            dislikes: 0,
            created_at: '',
            updated_at: '',
            post_id: '',
            creator:{
                creator_id: '',
                nickname: '',
            }
            }
        )
        
        const newPostDB = newPost.toDBModel()
        
        await this.postDatabase.insertNewPost(newPostDB)

        const output = {
            message: "Publicação realizada com sucesso!",
            post: newPost,
        }

        return output
    }

    public insertNewComment = async(input: InsertInputCommentDTO) => {

        const {id_post, content, token} = input

        if(typeof token !== "string"){
            throw new BadRequestError("'Token' não informado!")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null){
            throw new BadRequestError("'Token' inválido!")
        }

        const filterPostById = await this.postDatabase.getPostById(id_post)

        if(!filterPostById){
            throw new BadRequestError("'Post' não localizado!")
        }

        const id = this.idGenerator.generate()
        const created_at = (new Date()).toISOString()
        const updated_at = (new Date()).toISOString()
        const comments = 0
        const likes = 0
        const dislikes = 0
        const creator_id = payload.id
        
        if (content !== undefined){
            if(typeof content !== "string"){
                throw new BadRequestError("'content' deve ser uma string!")
            }
        }else{
            throw new BadRequestError("Por favor, informar o 'content'!")
        }

        const newComment = new Post (
            id,
            content,
            comments,
            likes,
            dislikes,
            created_at,
            updated_at,
            {id:creator_id,
            nickname: payload.nickname,},
            {id: '',
            content: '',
            likes: 0,
            dislikes: 0,
            created_at: '',
            updated_at: '',
            post_id: filterPostById.id,
            creator:{
                creator_id: '',
                nickname: '',
            }
            }
        )
        
        const postToUpdate = new Post(
            filterPostById.id,
            filterPostById.content,
            filterPostById.comments+1,
            filterPostById.likes,
            filterPostById.dislikes,
            filterPostById.created_at,
            filterPostById.updated_at,
            {
                id:filterPostById.creator_id,
                nickname: ''
            },
            {id: '',
            content: '',
            likes: 0,
            dislikes: 0,
            created_at: '',
            updated_at: '',
            post_id: '',
            creator:{
                creator_id: '',
                nickname: '',
            }
            }
        )

        const newCommentDB = newComment.toDBCommentModel()
        await this.postDatabase.insertNewComment(newCommentDB)
        const postToUpdateDB = postToUpdate.toDBModel()
        await this.postDatabase.updatePost(postToUpdateDB,filterPostById.id)

        const output = {
            message: "Publicação realizada com sucesso!",
        }

        return output
    }

    public updatePost = async (input: UpdateInputDTO) => {
        const {id,content,token} = input

        if(typeof token !== "string"){
            throw new BadRequestError("'Token' não informado!")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null){
            throw new BadRequestError("'Token' inválido!")
        }

        const filterPostToUpdate = await this.postDatabase.getPostById(id)

        if(!filterPostToUpdate){
            throw new BadRequestError("'Id' não localizada")
        }

        if(payload.role !== ROLE_USERS.ADMIN){
            if(filterPostToUpdate.creator_id !== payload.id){
                throw new BadRequestError("Somente quem criou pode editar esta publicação.")
            }
        }

        if (content !== undefined){
            if(typeof content !== "string"){
                throw new BadRequestError("'content' deve ser uma string")
            }
        }else{
            throw new BadRequestError(" Informar o 'content'!")
        }

        const updateAt = (new Date()).toISOString()

        const postToUpdate = new Post(
            id,
            content,
            filterPostToUpdate.comments,
            filterPostToUpdate.likes,
            filterPostToUpdate.dislikes,
            filterPostToUpdate.created_at,
            updateAt,
            {
                id:filterPostToUpdate.creator_id,
                nickname: payload.nickname
            },
            {id: '',
            content: '',
            likes: 0,
            dislikes: 0,
            created_at: '',
            updated_at: '',
            post_id: '',
            creator:{
                creator_id: '',
                nickname: '',
            }
            }
        )

        const postToUpdateDB = postToUpdate.toDBModel()
        await this.postDatabase.updatePost(postToUpdateDB,id)

        const output = {
            message: "Atualização realizada com sucesso",
            post: postToUpdate,
        }

        return output
    }

    public likeDislike = async (input: LikeDislikeDTO) => {
        const {id, like, token} = input

        if(typeof token !== "string"){
            throw new BadRequestError("'Token' não informado!")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null){
            throw new BadRequestError("'Token' inválido!")
        }

        const filterPostToLike = await this.postDatabase.getPostById(id)
        const filterCommentToLike = await this.postDatabase.getCommentById(id)
        const filterIdLD = await this.postDatabase.likeDislike(payload.id, id)

        if(filterIdLD){
            throw new BadRequestError("Você já deu like/dislike nesta publicação!")
        }

        if(!filterPostToLike && !filterCommentToLike){
            throw new BadRequestError("Publicação não encontrada!")
        }

        if(filterPostToLike){
            let likes = filterPostToLike.likes
            let dislikes = filterPostToLike.dislikes
    
            if(like === 0){
                dislikes++
                
            }else if(like === 1){
                likes++
            }else{
                throw new BadRequestError("número iválido! n° válidos: (1) like, (0) dislike")
            }
    
            const postToLike = new Post(
                id,
                filterPostToLike.content,
                filterPostToLike.comments,
                likes,
                dislikes,
                filterPostToLike.created_at,
                filterPostToLike.updated_at,
                {id: filterPostToLike.creator_id,
                nickname: ""},
                {id: '',
                content: '',
                likes: 0,
                dislikes: 0,
                created_at: '',
                updated_at: '',
                post_id: '',
                creator:{
                    creator_id: '',
                    nickname: '',
                }
                }
            )
    
            const updateLikeDB = {
                user_id: payload.id,
                post_id: id,
                like: 1
            } 
    
            const postToLikeDB = postToLike.toDBModel()

            await this.postDatabase.updatePost(postToLikeDB,id)
            await this.postDatabase.updateLikeDislike(updateLikeDB)
    
            if(like === 0){
                const output = {
                    message: "'Dislike' com sucesso!", 
                    }
                return output
            }else if(like===1){
                const output = {
                    message: "'Like' com sucesso!", 
                    }
                return output
            }
        }

        
        if(filterCommentToLike){

        let likes = 0
        let dislikes = 0

        if(like === 0){
            dislikes = 1          
        }else if(like === 1){
            likes = 1
        }else{
            throw new BadRequestError("número iválido! n° válidos: (1) like, (0) dislike")
        }
        const comments = 0

        const commentToLike = new Post(
            id,
            filterCommentToLike.content,
            comments,
            likes,
            dislikes,
            filterCommentToLike.created_at,
            filterCommentToLike.updated_at,
            {id: filterCommentToLike.creator_id,
            nickname: ""},
            {id: '',
            content: '',
            likes: 0,
            dislikes: 0,
            created_at: '',
            updated_at: '',
            post_id: '',
            creator:{
                creator_id: '',
                nickname: '',
            }
            }
        )

        const updateLikeDB = {
            user_id: payload.id,
            comment_id: id,
            like: 1
        } 

        const commentToLikeDB = commentToLike.toDBModel()
        await this.postDatabase.updateComment(commentToLikeDB,id)
        await this.postDatabase.updateLikeDislikeComment(updateLikeDB)

        if(like === 0){
            const output = {
                message: "'Dislike'com sucesso!", 
                }
            return output
        }else if(like===1){
            const output = {
                message: "'Like' com sucesso!", 
                }
            return output
        }
        }
    }

    public deletePost = async (input: DeleteInputPostDTO ) => {

        const {id, token} = input

        if(typeof token !== "string"){
            throw new BadRequestError("'Token' não informado!")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null){
            throw new BadRequestError("'Token' inválido!")
        }

        const filterPostToDelete = await this.postDatabase.getPostById(id)

        if(!filterPostToDelete){
            throw new BadRequestError("Publicação não encontrada!")
        }

        const filterUserDB = await this.userDatabase.getUserById(filterPostToDelete.creator_id)
        
        if(filterUserDB === undefined){
            throw new BadRequestError("Dados de publicação ausentes")
        }

        if(filterUserDB.role !== ROLE_USERS.ADMIN){
            if(filterUserDB.id !== payload.id){
                throw new BadRequestError("Procedimento não autorizado!")
            }
        }

        const filterLikeDislikeDB = await this.postDatabase.getLikeDislikeByPostId(id)

        if(filterLikeDislikeDB === undefined){
            return
        }

        if(filterLikeDislikeDB.length > 0){
            await this.postDatabase.deleteLikeDislike(id)
        }

        const filterCommentsDB = await this.postDatabase.getCommentsById(id)

        if(filterCommentsDB === undefined){
            return
        }

        if(filterCommentsDB.length > 0){
            const filterLikeDislikeCommentDB = await this.postDatabase.getLikeDislikeByCommentId(filterCommentsDB[0].id)
            if(filterLikeDislikeCommentDB === undefined){
                return
            }
            if(filterLikeDislikeCommentDB.length > 0){
                await this.postDatabase.deleteLikeDislike(filterCommentsDB[0].id)
            }
            await this.postDatabase.deleteCommentsById(id)
        }

        await this.postDatabase.deletePostById(id)
        const output = {
            message: "Publicação excluida com sucesso!",
            post: filterPostToDelete}
        return output

    }
}

