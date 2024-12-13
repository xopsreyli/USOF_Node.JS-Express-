import pool from '../../utils/db.js'

export const add = async (comment, user) => {
    await pool.query(
        'INSERT INTO comments (user_id, post_id, content) VALUES ($1, $2, $3);',
        [
            user.id,
            comment.postId,
            comment.content,
        ]
    )
}

export const remove = async id => {
    await pool.query(
        'DELETE FROM comments WHERE id = $1;',
        [ id ]
    )
}

export const findById = async id => {
    const result = await pool.query(
        'SELECT * FROM comments WHERE id = $1',
        [ id ]
    )

    return result.rows[0]
}

export const findByPost = async postId => {
    const result = await pool.query(
        'SELECT * FROM comments WHERE post_id = $1;',
        [ postId ]
    )

    return result.rows
}

export const updateStatus = async (id, status) => {
    await pool.query(
        'UPDATE comments SET status = $2 WHERE id = $1;',
        [ id, status ]
    )
}
