import pool from '../../utils/db.js'
import {USERS_PAGINATION_LIMIT} from "../../enums/PaginationLimitEnum.js";

export const add = async user => {
    const result = await pool.query(
        'INSERT INTO users (login, password, email, role) VALUES ($1, $2, $3, $4) RETURNING *;',
        [
            user.login,
            user.password,
            user.email,
            user.role
        ]
    )

    return result.rows[0]
}

export const save = async user => {
    await pool.query(
        'UPDATE users SET login = $2, password = $3, full_name = $4, email = $5, profile_picture = $6, rating = $7, role = $8, theme = $9, color_schema = $10, refresh_token = $11, is_confirmed = $12 WHERE id = $1;',
        [
            user.id,
            user.login,
            user.password,
            user.fullName,
            user.email,
            user.profilePicture,
            user.rating,
            user.role,
            user.theme,
            user.colorSchema,
            user.refreshToken,
            user.isConfirmed,
        ]
    )
}

export const remove = async id => {
    await pool.query(
        'DELETE FROM users WHERE id = $1;',
        [id]
    )
}

export const findAll = async (ids = null, params = {}) => {
    let query = 'SELECT * FROM users'
    let queryParams = []
    let queryParamsCounter = 1

    if (ids) {
        query += ` WHERE id = ANY($${queryParamsCounter++})`
        queryParams.push(ids)
    }

    if (params.login) {
        query += ` WHERE login ILIKE $${queryParamsCounter++}`
        queryParams.push(`%${params.login}%`)
    }

    if (params.rating) {
        query += ` ORDER BY rating ${params.rating}`
    }

    if (params.page) {
        query += ` LIMIT ${USERS_PAGINATION_LIMIT} OFFSET ${(params.page - 1) * USERS_PAGINATION_LIMIT}`
    }

    const result = await pool.query(query, queryParams)

    return result.rows
}

export const findById = async id => {
    const result = await pool.query(
        'SELECT * FROM users WHERE id = $1;',
        [id]
    )

    return result.rows[0]
}

export const findByLoginOrEmail = async identifier => {
    const result = await pool.query(
        'SELECT * FROM users WHERE login = $1 OR email = $1;',
        [identifier]
    )

    return result.rows[0]
}

export const findTop100 = async () => {
    const result = await pool.query(
        'SELECT * FROM users ORDER BY rating DESC, login ASC LIMIT 100'
    )

    return result.rows
}

export const confirmEmail = async id => {
    await pool.query(
        'UPDATE users SET is_confirmed = true WHERE id = $1;',
        [id]
    )
}

export const removeRefreshToken = async id => {
    await pool.query(
        'UPDATE users SET refresh_token = null WHERE id = $1;',
        [id]
    )
}

export const updatePassword = async (id, password) => {
    await pool.query(
        'UPDATE users SET password = $2 WHERE id = $1;',
        [
            id,
            password,
        ]
    )
}

export const updateAvatar = async (id, filename) => {
    await pool.query(
        'UPDATE users SET profile_picture = $2 WHERE id = $1;',
        [
            id,
            filename
        ]
    )
}

export const updateRating = async user => {
    await pool.query(
        'UPDATE users SET rating = $2 WHERE id = $1;',
        [ user.id, user.rating ]
    )
}
