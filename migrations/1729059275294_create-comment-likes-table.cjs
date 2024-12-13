exports.up = (pgm) => {
    pgm.createTable('comment_likes', {
        id: 'id',
        user_id: {
            type: 'integer',
            notNull: true,
            references: 'users',
            onDelete: 'cascade',
        },
        publish_date: {
            type: 'date',
            notNull: true,
            default: pgm.func('current_date'),
        },
        entity_id: {
            type: 'integer',
            references: 'comments',
            onDelete: 'cascade'
        },
        type: {
            type: 'varchar(8)',
            notNull: true,
            check: "type IN ('like', 'dislike')"
        }
    })
    pgm.createIndex('comment_likes', 'user_id')
    pgm.createIndex('comment_likes', 'entity_id')

    pgm.sql(`
        INSERT INTO comment_likes (user_id, entity_id, type) VALUES
        (1, 1, 'like'),
        (2, 1, 'dislike'),
        (3, 2, 'like'),
        (4, 3, 'like'),
        (5, 3, 'dislike'),
        (1, 4, 'like'),
        (2, 5, 'like'),
        (3, 5, 'dislike'),
        (4, 1, 'like'),
        (5, 2, 'dislike');
    `)
};

exports.down = (pgm) => {
    pgm.dropTable('comment_likes')
};
