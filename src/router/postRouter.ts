import express from 'express'
import { PostController } from '../controller/PostController'
import { PostBusiness } from '../business/PostBusiness'
import { PostDatabase } from '../database/PostDatabase'
import { UserDatabase } from '../database/UserDatabase'
import { IdGenerator } from '../services/IdGenerator'
import { TokenManager } from '../services/TokenManager'
import { PostDTO } from '../dtos/PostDTO'

export const postRouter = express.Router()

const postController = new PostController(
    new PostBusiness(
        new PostDatabase(),
        new UserDatabase(),
        new IdGenerator(),
        new TokenManager()),
    new PostDTO()
)

postRouter.get("/", postController.getAllPosts)
postRouter.get("/:id", postController.getPostsById)
//postRouter.get("/:nickname", postController.getPostByNickname)
postRouter.post("/", postController.insertNewPost)
postRouter.post("/:id", postController.insertNewComment)
postRouter.put("/:id", postController.updatePost)
postRouter.put("/:id/like", postController.likeDislike)
postRouter.delete("/:id", postController.deletePost)
//postRouter.delete("/:id", postController.deleteComment)

