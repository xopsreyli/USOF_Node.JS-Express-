import express from "express"
import authenticateToken from "../../../middleware/authenticateToken.js"
import * as service from '../../../services/api/post/postService.js'
import * as likeService from '../../../services/api/like/likeService.js'
import {POST_TABLE} from "../../../enums/LikeTableEnum.js"
import * as commentService from "../../../services/api/comment/commentService.js"
import * as postValidator from '../../../validators/api/postValidators.js'
import {createCommentSchema} from "../../../validators/api/commentValidators.js"
import {createLikeSchema} from "../../../validators/api/likeValidators.js"
import validateRequest from "../../../middleware/validateRequest.js"

const router = express.Router()

/**
 * @swagger
 *
 * /api/post/all:
 *  get:
 *    tags: [Post]
 *    description: Get info about all posts
 *    security:
 *      - BearerAuth: []
 *    parameters:
 *      - name: page
 *        in: query
 *        description: Pagination page number
 *        schema:
 *          type: integer
 *      - name: rating
 *        in: query
 *        description: Sorting by rating
 *        schema:
 *          type: string
 *          enum: [ASC, DESC]
 *      - name: date
 *        in: query
 *        description: Sorting by date
 *        schema:
 *          type: string
 *          enum: [ASC, DESC]
 *      - name: from
 *        in: query
 *        description: Shows from what date to query
 *        schema:
 *          type: string
 *          format: date
 *      - name: to
 *        in: query
 *        description: Shows till what date to query
 *        schema:
 *          type: string
 *          format: date
 *      - name: status
 *        in: query
 *        description: Shows status to query
 *        schema:
 *          type: string
 *          enum: [active, inactive]
 *      - name: title
 *        in: query
 *        description: Shows title to query
 *        schema:
 *          type: string
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Returns array of all posts
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/PostsInfoResponse'
 */
router.get(
    '/all',
    authenticateToken(false),
    async (req, res) => {
        const posts = await service.getAll(req.user, null, req.query)

        res.status(200).json({
            status: 200,
            posts: posts,
        })
    }
)

/**
 * @swagger
 *
 * /api/post/{id}:
 *  get:
 *    tags: [Post]
 *    description: Get info about certain post by id
 *    security:
 *      - BearerAuth: []
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID of the post
 *        required: true
 *        schema:
 *          type: integer
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Returns info about post
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/PostInfoResponse'
 *      403:
 *        description: Forbidden. No permission
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 *      404:
 *        description: Post was not found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
    '/:id',
    authenticateToken(false),
    async (req, res) => {
        try {
            const post = await service.get(Number(req.params.id), req.user)

            res.status(200).json({
                status: 200,
                post: post,
            })
        } catch (e) {
            res.status(e.statusCode).json({
                status: e.statusCode,
                message: e.message,
            })
        }
    }
)

/**
 * @swagger
 *
 * /api/post/{id}/comments:
 *  get:
 *    tags: [Post]
 *    description: Get all post comments
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID of the post
 *        required: true
 *        schema:
 *          type: integer
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Returns all post comments
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CommentsOfThePostResponse'
 */
router.get(
    '/:id/comments',
    async (req, res) => {
        const comments = await commentService.getCommentsByPost(Number(req.params.id))

        res.status(200).json({
            status: 200,
            comments: comments
        })
    }
)

/**
 * @swagger
 *
 * /api/post/{id}/comment:
 *  post:
 *    tags: [Post]
 *    description: Add comment under the post
 *    security:
 *      - BearerAuth: []
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID of the post
 *        required: true
 *        schema:
 *          type: integer
 *    produces:
 *      - application/json
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/AddCommentRequest'
 *    responses:
 *      200:
 *        description: Comment was successfully added
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/SuccessResponse'
 *      400:
 *        description: Invalid request data
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 *      401:
 *        description: Unauthorized. No token provided
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 *      403:
 *        description: Forbidden. Token is invalid
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
    '/:id/comment',
    authenticateToken(true),
    validateRequest(createCommentSchema),
    async (req, res) => {
        await commentService.create(Number(req.params.id), req.body, req.user)

        res.status(200).json({
            status: 200,
            message: 'Comment was successfully created'
        })
    }
)

/**
 * @swagger
 *
 * /api/post/{id}/categories:
 *  get:
 *    tags: [Post]
 *    description: Get all post categories
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID of the post
 *        required: true
 *        schema:
 *          type: integer
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Returns all post categories
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CategoriesOfThePostResponse'
 *      404:
 *        description: Post was not found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
    '/:id/categories',
    async (req, res) => {
        try {
            const categories = await service.getPostCategories(Number(req.params.id))

            res.status(200).json({
                status: 200,
                categories: categories,
            })
        } catch (e) {
            res.status(e.statusCode).json({
                status: e.statusCode,
                message: e.message,
            })
        }
    }
)

/**
 * @swagger
 *
 * /api/post/{id}/likes:
 *  get:
 *    tags: [Post]
 *    description: Get all post likes
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID of the post
 *        required: true
 *        schema:
 *          type: integer
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Returns all post likes
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/LikesOfThePostResponse'
 */
router.get(
    '/:id/likes',
    async (req, res) => {
        const likes = await likeService.getLikes(Number(req.params.id), POST_TABLE)

        res.status(200).json({
            status: 200,
            likes: likes,
        })
    }
)

/**
 * @swagger
 *
 * /api/post:
 *  post:
 *    tags: [Post]
 *    description: Create new post
 *    security:
 *      - BearerAuth: []
 *    produces:
 *      - application/json
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/CreatePostRequest'
 *    responses:
 *      200:
 *        description: Post was successfully created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreatePostResponse'
 *      400:
 *        description: Invalid request data
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 *      401:
 *        description: Unauthorized. No token provided
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 *      403:
 *        description: Forbidden. Token is invalid or user is not admin
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
    '/',
    authenticateToken(true),
    validateRequest(postValidator.createPostSchema),
    async (req, res) => {
        const id = await service.create(req.body, req.user)

        res.status(200).json({
            status: 200,
            id: id,
        })
    }
)

/**
 * @swagger
 *
 * /api/post/{id}/like:
 *  post:
 *    tags: [Post]
 *    description: Like post
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID of the post
 *        required: true
 *        schema:
 *          type: integer
 *    security:
 *      - BearerAuth: []
 *    produces:
 *      - application/json
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/LikePostRequest'
 *    responses:
 *      200:
 *        description: Post was successfully liked
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/SuccessResponse'
 *      400:
 *        description: Invalid request data
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 *      401:
 *        description: Unauthorized. No token provided
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 *      403:
 *        description: Forbidden. Token is invalid
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 *      409:
 *        description: Conflict. Post is already liked
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
    '/:id/like',
    authenticateToken(true),
    validateRequest(createLikeSchema),
    async (req, res) => {
        try {
            await likeService.like(Number(req.params.id), req.body, req.user, POST_TABLE)

            res.status(200).json({
                status: 200,
                message: "Post was liked",
            })
        } catch (e) {
            res.status(e.statusCode).json({
                status: e.statusCode,
                message: e.message,
            })
        }
    }
)

/**
 * @swagger
 *
 * /api/post/{id}/favorite:
 *  post:
 *    tags: [Post]
 *    description: Make post favorite
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID of the post
 *        required: true
 *        schema:
 *          type: integer
 *    security:
 *      - BearerAuth: []
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Post was successfully added to favorites
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/SuccessResponse'
 *      401:
 *        description: Unauthorized. No token provided
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 *      403:
 *        description: Forbidden. Token is invalid
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 *      404:
 *        description: Post was not found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 *      409:
 *        description: Post is already in favorites
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
    '/:id/favorite',
    authenticateToken(true),
    async (req, res) => {
        try {
            await service.makeFavorite(Number(req.params.id), req.user)

            res.status(200).json({
                status: 200,
                message: 'Post was successfully added to favorites',
            })
        } catch (e) {
            res.status(e.statusCode).json({
                status: e.statusCode,
                message: e.message,
            })
        }
    }
)

/**
 * @swagger
 *
 * /api/post/{id}/favorite:
 *  delete:
 *    tags: [Post]
 *    description: Remove post from favorites
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID of the post
 *        required: true
 *        schema:
 *          type: integer
 *    security:
 *      - BearerAuth: []
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Post was successfully removed from favorites
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/SuccessResponse'
 *      401:
 *        description: Unauthorized. No token provided
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 *      403:
 *        description: Forbidden. Token is invalid
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 *      404:
 *        description: No such post in favorites
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 */
router.delete(
    '/:id/favorite',
    authenticateToken(true),
    async (req, res) => {
        try {
            await service.unfavorite(Number(req.params.id), req.user)

            res.status(200).json({
                status: 200,
                message: 'Post was successfully removed from favorites',
            })
        } catch (e) {
            res.status(e.statusCode).json({
                status: e.statusCode,
                message: e.message,
            })
        }
    }
)

/**
 * @swagger
 *
 * /api/post/{id}:
 *  patch:
 *    tags: [Post]
 *    description: Update post info
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID of the post
 *        required: true
 *        schema:
 *          type: integer
 *    security:
 *      - BearerAuth: []
 *    produces:
 *      - application/json
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/UpdatePostRequest'
 *    responses:
 *      200:
 *        description: Post was successfully updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/SuccessResponse'
 *      400:
 *        description: Invalid request data
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 *      401:
 *        description: Unauthorized. No token provided
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 *      403:
 *        description: Forbidden. Token is invalid or user is not admin
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 *      404:
 *        description: Post was not found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 */
router.patch(
    '/:id',
    authenticateToken(true),
    validateRequest(postValidator.updatePostSchema),
    async (req, res)  => {
        try {
            await service.update(Number(req.params.id), req.body, req.user)

            res.status(200).json({
                status: 200,
                message: 'Post was successfully updated',
            })
        } catch (e) {
            res.status(e.statusCode).json({
                status: e.statusCode,
                message: e.message,
            })
        }
    }
)

/**
 * @swagger
 *
 * /api/post/{id}:
 *  delete:
 *    tags: [Post]
 *    description: Delete post
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID of the post
 *        required: true
 *        schema:
 *          type: integer
 *    security:
 *      - BearerAuth: []
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Post was successfully deleted
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/SuccessResponse'
 *      401:
 *        description: Unauthorized. No token provided
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 *      403:
 *        description: Forbidden. Token is invalid or user is not admin
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 *      404:
 *        description: Post was not found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 */
router.delete(
    '/:id',
    authenticateToken(true),
    async (req, res) => {
        try {
            await service.remove(Number(req.params.id), req.user)

            res.status(200).json({
                status: 200,
                message: 'Post was successfully deleted',
            })
        } catch (e) {
            res.status(e.statusCode).json({
                status: e.statusCode,
                message: e.message,
            })
        }
    }
)

/**
 * @swagger
 *
 * /api/post/{id}/like:
 *  delete:
 *    tags: [Post]
 *    description: Delete like under post
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID of the post
 *        required: true
 *        schema:
 *          type: integer
 *    security:
 *      - BearerAuth: []
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Post was successfully deleted
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/SuccessResponse'
 *      401:
 *        description: Unauthorized. No token provided
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 *      403:
 *        description: Forbidden. Token is invalid
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 *      404:
 *        description: There was no like under this post
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 */
router.delete(
    '/:id/like',
    authenticateToken(true),
    async (req, res) => {
        try {
            await likeService.unlike(Number(req.params.id), req.user, POST_TABLE)

            res.status(200).json({
                status: 200,
                message: 'Like was successfully removed',
            })
        } catch (e) {
            res.status(e.statusCode).json({
                status: e.statusCode,
                message: e.message,
            })
        }
    }
)

export default router
