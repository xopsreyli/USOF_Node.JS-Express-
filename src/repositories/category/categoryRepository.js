import pool from '../../utils/db.js'
import {CATEGORIES_PAGINATION_LIMIT} from "../../enums/PaginationLimitEnum.js";

export const add = async category => {
    await pool.query(
        'INSERT INTO categories (title, description) VALUES ($1, $2);',
        [category.title, category.description]
    )
}

export const save = async category => {
    await pool.query(
        'UPDATE categories SET title = $2, description = $3 WHERE id = $1;',
        [
            category.id,
            category.title,
            category.description,
        ]
    )
}

export const remove = async id => {
    await pool.query(
        'DELETE FROM categories WHERE id = $1;',
        [ id ]
    )
}

export const findAll = async (ids = null, params = {}) => {
    let query = 'SELECT * FROM categories'
    let queryParams = []
    let queryParamsCounter = 1

    if (ids) {
        query += ` WHERE id = ANY($${queryParamsCounter++})`
        queryParams.push(ids)
    }

    if (params.title) {
        query += ` WHERE title ILIKE $${queryParamsCounter++}`
        queryParams.push(`%${params.title}%`)
    }

    if (params.numberOfPosts) {
        query += ` ORDER BY number_of_posts ${params.numberOfPosts}`
    }

    if (params.page) {
        query += ` LIMIT ${CATEGORIES_PAGINATION_LIMIT} OFFSET ${(params.page - 1) * CATEGORIES_PAGINATION_LIMIT}`
    }

    const result = await pool.query(query, queryParams)

    return result.rows
}

export const findById = async id => {
    const result = await pool.query(
        'SELECT * FROM categories WHERE id = $1',
        [ id ]
    )

    return result.rows[0]
}

export const findAllPostsRelations = async id => {
    const result = await pool.query(
        'SELECT * FROM post_category WHERE category_id = $1',
        [ id ]
    )

    return result.rows
}
