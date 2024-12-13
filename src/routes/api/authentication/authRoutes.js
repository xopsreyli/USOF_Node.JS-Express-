import express from 'express'
import * as service from '../../../services/api/authentication/authService.js'
import authenticateToken from "../../../middleware/authenticateToken.js"
import validateRequest from "../../../middleware/validateRequest.js"
import * as authValidators from "../../../validators/api/authValidators.js"

const router = express.Router()

/**
 * @swagger
 *
 * /api/auth/register:
 *  post:
 *    tags: [Authentication]
 *    description: User registration
 *    produces:
 *      - application/json
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/RegisterRequest'
 *    responses:
 *      200:
 *        description: Successful registration
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
    '/register',
    validateRequest(authValidators.registerSchema),
    async (req, res) => {
        try {
            await service.create(req.body)

            res.status(200).json({
                status: 200,
                message: 'Successful registration'
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
 * /api/auth/confirm-email:
 *  post:
 *    tags: [Authentication]
 *    description: Confirms user's email
 *    produces:
 *      - application/json
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ConfirmEmailRequest'
 *    responses:
 *      200:
 *        description: User's email was successfully confirmed
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/SuccessResponse'
 *      401:
 *        description: Invalid token
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 *      404:
 *        description: User was not found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
    '/confirm-email',
    async (req, res) => {
        try {
            await service.confirmEmail(req.body)

            res.status(200).json({
                status: 200,
                message: 'User\'s email was successfully confirmed'
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
 * /api/auth/login:
 *  post:
 *    tags: [Authentication]
 *    description: Log in user and returns tokens
 *    produces:
 *      - application/json
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/LoginRequest'
 *    responses:
 *      200:
 *        description: Successful log in
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/LoginResponse'
 *      401:
 *        description: Invalid credentials
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 *      403:
 *        description: User is not confirmed.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
    '/login',
    async (req, res) => {
        try {
            const tokens = await service.login(req.body)

            res.status(200).json({
                status: 200,
                tokens: tokens,
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
 * /api/auth/token/update:
 *  post:
 *    tags: [Authentication]
 *    description: Update access token
 *    produces:
 *      - application/json
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/TokenUpdateRequest'
 *    responses:
 *      200:
 *        description: Token was updated successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/TokenUpdateResponse'
 *      403:
 *        description: Invalid token
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
    '/token/update',
    async (req, res) => {
        try {
            const accessToken = await service.updateToken(req.body)

            res.status(200).json({
                status: 200,
                token: accessToken,
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
 * /api/auth/logout:
 *  post:
 *    tags: [Authentication]
 *    description: Log out user
 *    security:
 *      - BearerAuth: []
 *    produces:
 *      - application/json
 *    requestBody:
 *      required: false
 *    responses:
 *      200:
 *        description: Successful log out
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
 */
router.post(
    '/logout',
    authenticateToken(true),
    async (req, res) => {
        await service.logout(req.user)

        res.status(200).json({
            status: 200,
            message: 'User was successfully logged out'
        })
    }
)

/**
 * @swagger
 *
 * /api/auth/password-reset:
 *  post:
 *    tags: [Authentication]
 *    description: Sends reset password link to user's email
 *    produces:
 *      - application/json
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ResetPasswordRequest'
 *    responses:
 *      200:
 *        description: Link was successfully sent to email
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/SuccessResponse'
 *      404:
 *        description: User with such email was not found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 *      500:
 *        description: Internal Server Error (e.g., failed ot send password reset link)
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
    '/password-reset',
    async (req, res) => {
        try {
            await service.resetPassword(req.body)

            res.status(200).json({
                status: 200,
                message: 'Link to reset password was sent to user\'s email'
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
 * /api/auth/password-reset/update:
 *  post:
 *    tags: [Authentication]
 *    description: Update user's password
 *    produces:
 *      - application/json
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ResetPasswordUpdateRequest'
 *    responses:
 *      200:
 *        description: Password was successfully updated
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
 *      403:
 *        description: Invalid token
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
    '/password-reset/update',
    validateRequest(authValidators.passwordResetUpdateSchema),
    async (req, res) => {
        try {
            await service.updatePassword(req.body)

            res.status(200).json({
                status: 200,
                message: 'Password was successfully updated',
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
