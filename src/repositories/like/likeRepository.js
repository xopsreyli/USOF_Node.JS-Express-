import pool from '../../utils/db.js'

export const add = async (tableName, like, user) => {
    await pool.query(
        `INSERT INTO ${tableName} (user_id, entity_id, type) VALUES ($1, $2, $3);`,
        [
            user.id,
            like.entityId,
            like.type,
        ]
    )
}

export const remove = async (tableName, id) => {
    await pool.query(
        `DELETE FROM ${tableName} WHERE id = $1`,
        [ id ]
    )
}

export const findAllByEntity = async (tableName, id) => {
    const result = await pool.query(
        `SELECT * FROM ${tableName} WHERE entity_id = $1;`,
        [ id ]
    )

    return result.rows
}

export const findByEntityAndUser = async (tableName, entityId, userId) => {
    const result = await pool.query(
        `SELECT * FROM ${tableName} WHERE user_id = $1 AND entity_id = $2;`,
        [
            userId,
            entityId,
        ]
    )

    return result.rows[0]
}
