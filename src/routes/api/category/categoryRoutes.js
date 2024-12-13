import express from "express"
import * as service from '../../../services/api/category/categoryService.js'
import authenticateToken from "../../../middleware/authenticateToken.js"
import verifyAdmin from "../../../middleware/verifyAdmin.js"
import validateRequest from "../../../middleware/validateRequest.js"
import * as categoryValidator from '../../../validators/api/categoryValidators.js'
import {updateCategorySchema} from "../../../validators/api/categoryValidators.js";

const router = express.Router()

/**
 * @swagger
 *
 * /api/category/all:
 *  get:
 *    tags: [Category]
 *    description: Get info about all categories
 *    parameters:
 *      - name: page
 *        in: query
 *        description: Pagination page number
 *        schema:
 *          type: integer
 *      - name: title
 *        in: query
 *        description: Shows title to query
 *        schema:
 *          type: string
 *      - name: numberOfPosts
 *        in: query
 *        description: Sorting by number of posts
 *        schema:
 *          type: string
 *          enum: [ASC, DESC]
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Returns array of all categories
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CategoriesResponse'
 */
router.get(
    '/all',
    async (req, res) => {
        const categories = await service.getAll(req.query)

        res.status(200).json({
            status: 200,
            categories: categories,
        })
    }
)

/**
 * @swagger
 *
 * /api/category/{id}:
 *  get:
 *    tags: [Category]
 *    description: Get info about certain category by id
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID of the category
 *        required: true
 *        schema:
 *          type: integer
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Returns info about category
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CategoryResponse'
 *      404:
 *        description: Category was not found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
    '/:id',
    async (req, res) => {
        try {
            const category = await service.get(Number(req.params.id))

            res.status(200).json({
                status: 200,
                category: category,
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
 * /api/category/{id}/posts:
 *  get:
 *    tags: [Category]
 *    description: Get info about all posts related to the certain category
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID of the category
 *        required: true
 *        schema:
 *          type: integer
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
 *        description: Returns info about all posts related to the certain category
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CategoryPostsResponse'
 */
router.get(
    '/:id/posts',
    authenticateToken(false),
    async (req, res) => {
        const posts = await service.getCategoryPosts(Number(req.params.id), req.user, req.query)

        res.status(200).json({
            status: 200,
            posts: posts,
        })
    }
)

/**
 * @swagger
 *
 * /api/category:
 *  post:
 *    tags: [Category]
 *    description: Create new category
 *    produces:
 *      - application/json
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/CreateCategoryRequest'
 *    responses:
 *      200:
 *        description: Category was successfully created
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
 */
router.post(
    '/',
    authenticateToken(true),
    verifyAdmin,
    validateRequest(categoryValidator.createCategorySchema),
    async (req, res) => {
        await service.create(req.body)

        res.status(200).json({
            status: 200,
            message: 'Category was successfully created',
        })
    }
)

/**
 * @swagger
 *
 * /api/category/{id}:
 *  patch:
 *    tags: [Category]
 *    description: Update category
 *    produces:
 *      - application/json
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/UpdateCategoryRequest'
 *    responses:
 *      200:
 *        description: Category was successfully updated
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
 *        description: Category was not found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 */
router.patch(
    '/:id',
    authenticateToken(true),
    verifyAdmin,
    validateRequest(updateCategorySchema),
    async (req, res) => {
        try {
            await service.update(Number(req.params.id), req.body)

            res.status(200).json({
                status: 200,
                message: 'Category was successfully updated',
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
 * /api/category/{id}:
 *  delete:
 *    tags: [Category]
 *    description: Delete category
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID of the category
 *        required: true
 *        schema:
 *          type: integer
 *    security:
 *      - BearerAuth: []
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Category was successfully deleted
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
 *        description: Category was not found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 */
router.delete(
    '/:id',
    authenticateToken(true),
    verifyAdmin,
    async (req, res) => {
        try {
            await service.remove(Number(req.params.id))

            res.status(200).json({
                status: 200,
                message: 'Category was successfully deleted',
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
