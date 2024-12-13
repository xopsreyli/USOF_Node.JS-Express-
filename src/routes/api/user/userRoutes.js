import express from 'express'
import * as service from '../../../services/api/user/userService.js'
import { create } from "../../../services/api/authentication/authService.js"
import authenticateToken from "../../../middleware/authenticateToken.js"
import { upload } from '../../../utils/multer.js'
import verifyAdmin from "../../../middleware/verifyAdmin.js"
import validateRequest from "../../../middleware/validateRequest.js"
import * as userValidator from '../../../validators/api/userValidators.js'

const router = express.Router()

/**
 * @swagger
 *
 * /api/user/all:
 *  get:
 *    tags: [User]
 *    description: Get info about all users
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
 *      - name: login
 *        in: query
 *        description: Shows title to query
 *        schema:
 *          type: string
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Returns array of all users
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UsersInfoResponse'
 */
router.get(
    '/all',
    authenticateToken(false),
    async (req, res) => {
        const users = await service.getAll(req.query)

        res.status(200).json({
            status: 200,
            users: users,
        })
    }
)

/**
 * @swagger
 *
 * /api/user:
 *  get:
 *    tags: [User]
 *    description: Get info about current user
 *    security:
 *      - BearerAuth: []
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Returns current user info
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserInfoResponse'
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
 *        description: User not found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/',
  authenticateToken(true),
  async (req, res) => {
    try {
      const user = await service.get(req.user.id)

      res.status(200).json({
        status: 200,
        user: user
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
 * /api/user/{id}:
 *  get:
 *    tags: [User]
 *    description: Get info about certain user by id
 *    security:
 *      - BearerAuth: []
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID of the user
 *        required: true
 *        schema:
 *          type: integer
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Returns user info
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserInfoResponse'
 *      404:
 *        description: User not found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
    '/:id(\\d+)',
    authenticateToken(false),
    async (req, res) => {
        try {
            const user = await service.get(Number(req.params.id))

            res.status(200).json({
                status: 200,
                user: user
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
 * /api/user/{id}/posts:
 *  get:
 *    tags: [User]
 *    description: Get all posts where user is author
 *    security:
 *      - BearerAuth: []
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID of the user
 *        required: true
 *        schema:
 *          type: integer
 *      - name: page
 *        in: query
 *        required: true
 *        description: Pagination page number
 *        schema:
 *          type: integer
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Returns all posts where user is author
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/PostsInfoResponse'
 *      404:
 *        description: User not found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
    '/:id/posts',
  authenticateToken(false),
    async (req, res) => {
        try {
            const posts = await service.getUserPosts(Number(req.params.id), req.query)

            res.status(200).json({
                status: 200,
                posts: posts,
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
 * /api/user/favorites:
 *  get:
 *    tags: [User]
 *    description: Get all user favorites posts
 *    security:
 *      - BearerAuth: []
 *    parameters:
 *      - name: page
 *        in: query
 *        required: true
 *        description: Pagination page number
 *        schema:
 *          type: integer
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Returns all user favorites posts
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/PostsInfoResponse'
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
router.get(
    '/favorites',
    authenticateToken(true),
    async (req, res) => {
        const posts = await service.getUserFavoritesPosts(req.user, req.query)

        res.status(200).json({
            status: 200,
            posts: posts,
        })
    }
)

/**
 * @swagger
 *
 * /api/user/top:
 *  get:
 *    tags: [User]
 *    description: Get top 100 users
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Returns top 100 users
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UsersInfoResponse'
 */
router.get(
    '/top',
    async (req, res) => {
        const users = await service.getTop()

        res.status(200).json({
            status: 200,
            users: users,
        })
    }
)

/**
 * @swagger
 *
 * /api/user:
 *  post:
 *    tags: [User]
 *    description: User creation route
 *    produces:
 *      - application/json
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/CreateUserRequest'
 *    responses:
 *      200:
 *        description: User was successfully created
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
 *      409:
 *        description: User with such login or email already exists
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 *      500:
 *        description: Internal Server Error (e.g., failed ot send email)
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
    '/',
    authenticateToken(true),
    verifyAdmin,
    validateRequest(userValidator.createUserSchema),
    async (req, res) => {
        try {
            await create(req.body)

            res.status(200).json({
                status: 200,
                message: 'User was successfully created'
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
 * /api/user/avatar:
 *  patch:
 *    tags: [User]
 *    description: Update user profile picture
 *    produces:
 *      - application/json
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            $ref: '#/components/schemas/UpdateUserAvatarRequest'
 *    responses:
 *      200:
 *        description: User profile picture was successfully updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/SuccessResponse'
 *      400:
 *        description: Bad Request. Wrong format of file
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
 *        description: User not found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 */
router.patch(
    '/avatar',
    authenticateToken(true),
    // validateRequest(userValidator.updateUserProfilePictureSchema),
    upload.single('profilePicture'),
    async (req, res) => {
        try {
            await service.updateAvatar(req.user, req.file)

            res.status(200).json({
                status: 200,
                message: 'User info was successfully updated'
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
 * /api/user/{id}:
 *  patch:
 *    tags: [User]
 *    description: Update user info(login, password, fullName, email, profilePicture, role, theme, colorSchema)
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID of the user
 *        required: true
 *        schema:
 *          type: integer
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/UpdateUserRequest'
 *    responses:
 *      200:
 *        description: User info was successfully updated
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
 *        description: No permission
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 *      404:
 *        description: User not found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 *      500:
 *        description: Internal Server Error (e.g., failed ot send email, failed to reset profile picture)
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 */
router.patch(
    '/:id',
    authenticateToken(true),
    validateRequest(userValidator.updateUserSchema),
    async (req, res) => {
        try {
            await service.update(req.body, req.user, Number(req.params.id))

            res.status(200).json({
                status: 200,
                message: 'User info was successfully updated'
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
 * /api/user/{id}:
 *  delete:
 *    tags: [User]
 *    description: Delete user
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID of the user
 *        required: true
 *        schema:
 *          type: integer
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: User was successfully deleted
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/SuccessResponse'
 *      403:
 *        description: No permission
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 *      404:
 *        description: User not found
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
                message: 'User was successfully deleted'
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
