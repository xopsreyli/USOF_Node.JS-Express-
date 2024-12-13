import pool from '../../utils/db.js'
import {ACTIVE, INACTIVE} from "../../enums/StatusEnum.js"
import { USER_ROLE, ADMIN_ROLE } from "../../enums/UserRoleEnum.js"
import {POSTS_PAGINATION_LIMIT} from "../../enums/PaginationLimitEnum.js"

export const add = async (post, authorId) => {
    const result = await pool.query(
        'INSERT INTO posts (user_id, title, content) VALUES ($1, $2, $3) RETURNING *;',
        [
            authorId,
            post.title,
            post.content
        ]
    )

    return result.rows[0].id
}

export const save = async post => {
    await pool.query(
        'UPDATE posts SET title = $2, status = $3, content = $4 WHERE id = $1;',
        [
            post.id,
            post.title,
            post.status,
            post.content,
        ]
    )
}

export const remove = async id => {
    await pool.query('DELETE FROM posts WHERE id = $1', [id])
}

const andOrWhereQueryInsert = (query, logicToAdd, isWhere) => {
    query += isWhere.value ? ' AND' : ' WHERE'
    query += logicToAdd
    isWhere.value = true

    return query
}

export const findAll = async (user, ids = null, params = {}) => {
    let query = `SELECT * FROM posts`;
    let queryParams = [];
    let queryParamsCounter = 1
    let isWhere = { value: false }

    if (ids) {
        query = andOrWhereQueryInsert(query, ` id = ANY($${queryParamsCounter++})`, isWhere)
        queryParams.push(ids);
    }

    if (user) {
        if (user.role === USER_ROLE) {
            if (params.status === ACTIVE) {
                query = andOrWhereQueryInsert(query, ` status = '${ACTIVE}'`, isWhere)
            } else if (params.status === INACTIVE) {
                query = andOrWhereQueryInsert(query, ` (status = '${INACTIVE}' AND user_id = '${user.id}')`, isWhere)
            } else {
                query = andOrWhereQueryInsert(query, ` (status = '${ACTIVE}' OR user_id = '${user.id}')`, isWhere)
            }
        } else if (user.role === ADMIN_ROLE && params.status) {
            query = andOrWhereQueryInsert(query, ` status = '${params.status}'`, isWhere)
        }
    } else {
        if (params.status === INACTIVE) {
            return []
        }
        query = andOrWhereQueryInsert(query, ` status = '${ACTIVE}'`, isWhere)
    }

    if (params.title) {
        query = andOrWhereQueryInsert(query, ` title ILIKE $${queryParamsCounter++}`, isWhere)
        queryParams.push(`%${params.title}%`)
    }

    if (params.from) {
        query = andOrWhereQueryInsert(query, ` publish_date >= '${params.from}'`, isWhere)
    }

    if (params.to) {
        query = andOrWhereQueryInsert(query, ` publish_date <= '${params.to}'`, isWhere)
    }

    if (params.date) {
        query += ` ORDER BY publish_date ${params.date}, rating ${params.rating}`
    } else {
        query += ` ORDER BY rating ${params.rating}`
    }

    query += ` LIMIT ${POSTS_PAGINATION_LIMIT} OFFSET ${(params.page - 1) * POSTS_PAGINATION_LIMIT}`

    const result = await pool.query(query, queryParams);

    return result.rows;
}

export const findAllByUser = async (userId, params = {}) => {
    const result = await pool.query(
        `SELECT * FROM posts WHERE user_id = $1 ORDER BY publish_date DESC LIMIT ${POSTS_PAGINATION_LIMIT} OFFSET ${(params.page - 1) * POSTS_PAGINATION_LIMIT};`,
        [ userId ]
    )

    return result.rows
}

export const findById = async id => {
    const result = await pool.query(
        'SELECT * FROM posts WHERE id = $1;',
        [id]
    )

    return result.rows[0]
}

export const addCategories = async (id, categories) => {
    let values = categories.map((c, i) => `($1, $${i + 2})`).join(', ')
    let query = `INSERT INTO post_category (post_id, category_id) VALUES ${values};`

    await pool.query(query, [id, ...categories])
}

export const removeCategories = async (id, categories) => {
    await pool.query(
        'DELETE FROM post_category WHERE post_id = $1 AND category_id = ANY($2)',
        [
            id,
            categories
        ]
    )
}

export const findPostsCategoriesRelations = async ids => {
    const result = await pool.query(
        'SELECT * FROM post_category WHERE post_id = ANY($1)',
        [ ids ]
    )

    return result.rows
}
