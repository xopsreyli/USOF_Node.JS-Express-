import pool from '../../utils/db.js'

export const add = async (userId, postId) => {
    await pool.query(
        'INSERT INTO favorites (user_id, post_id) VALUES ($1, $2);',
        [
            userId,
            postId,
        ]
    )
}

export const remove = async (userId, postId) => {
    await pool.query(
        'DELETE FROM favorites WHERE user_id = $1 AND post_id = $2;',
        [
            userId,
            postId,
        ]
    )
}

export const find = async (userId, postId) => {
    const result = await pool.query(
        'SELECT * FROM favorites WHERE user_id = $1 AND post_id = $2;',
        [
            userId,
            postId,
        ]
    )

    return result.rows[0]
}

export const findByUser = async user => {
    const result = await pool.query(
        'SELECT * FROM favorites WHERE user_id = $1',
        [ user.id ]
    )

    return result.rows
}
