import express from "express"
import authenticateToken from "../../../middleware/authenticateToken.js"
import verifyAdmin from "../../../middleware/verifyAdmin.js"
import * as service from '../../../services/api/comment/commentService.js'
import * as likeService from '../../../services/api/like/likeService.js'
import {COMMENT_TABLE} from "../../../enums/LikeTableEnum.js"
import {COMMENT} from "../../../enums/EntityTypeEnum.js"
import * as commentValidator from '../../../validators/api/commentValidators.js'
import validateRequest from "../../../middleware/validateRequest.js"
import {createLikeSchema} from "../../../validators/api/likeValidators.js"

const router = express.Router()

/**
 * @swagger
 *
 * /api/comment/{id}:
 *  get:
 *    tags: [Comment]
 *    description: Get info about certain comment by id
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID of the comment
 *        required: true
 *        schema:
 *          type: integer
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Returns info about comment
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CommentResponse'
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
 *        description: Comment was not found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
    '/:id',
    authenticateToken(true),
    verifyAdmin,
    async (req, res) => {
        try {
            const comment = await service.get(Number(req.params.id))

            res.status(200).json({
                status: 200,
                comment: comment
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
 * /api/comment/{id}/likes:
 *  get:
 *    tags: [Comment]
 *    description: Get info about all likes of the comment
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID of the comment
 *        required: true
 *        schema:
 *          type: integer
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Returns all comment's likes
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CommentLikesResponse'
 */
router.get(
    '/:id/likes',
    async (req, res) => {
        const likes = await likeService.getLikes(Number(req.params.id), COMMENT_TABLE)

        res.status(200).json({
            status: 200,
            likes: likes,
        })
    }
)

/**
 * @swagger
 *
 * /api/comment/{id}/like:
 *  post:
 *    tags: [Comment]
 *    description: Like comment
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID of the comment
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
 *            $ref: '#/components/schemas/LikeCommentRequest'
 *    responses:
 *      200:
 *        description: Returns info about comment
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
 *        description: Conflict. Comment is already liked
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
            await likeService.like(Number(req.params.id), req.body, req.user, COMMENT_TABLE)

            res.status(200).json({
                status: 200,
                message: 'Comment was liked',
            })
        } catch (e) {
            res.status(e.statusCode).json({
                status: e.statusCode,
                message: e.comment,
            })
        }
    }
)

/**
 * @swagger
 *
 * /api/comment/{id}:
 *  patch:
 *    tags: [Comment]
 *    description: Update comment info
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID of the comment
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
 *            $ref: '#/components/schemas/UpdateCommentRequest'
 *    responses:
 *      200:
 *        description: Comment was successfully updated
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
 *        description: Comment was not found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 */
router.patch(
    '/:id',
    authenticateToken(true),
    validateRequest(commentValidator.updateCommentSchema),
    async (req, res) => {
        try {
            await service.update(Number(req.params.id), req.body, req.user)

            res.status(200).json({
                status: 200,
                message: 'Comment info was updated',
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
 * /api/comment/{id}:
 *  delete:
 *    tags: [Comment]
 *    description: Delete comment
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID of the comment
 *        required: true
 *        schema:
 *          type: integer
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Comment was successfully deleted
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
 *        description: Comment was not found
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
                message: 'Comment was deleted',
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
 * /api/comment/{id}/like:
 *  delete:
 *    tags: [Comment]
 *    description: Unlike comment
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID of the comment
 *        required: true
 *        schema:
 *          type: integer
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Comment was successfully unliked
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
 *        description: There was no like under this comment
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
            await likeService.unlike(Number(req.params.id), req.user, COMMENT_TABLE)

            res.status(200).json({
                status: 200,
                message: 'Comment was unliked',
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
