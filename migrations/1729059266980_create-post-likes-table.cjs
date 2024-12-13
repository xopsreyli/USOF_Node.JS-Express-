exports.up = (pgm) => {
    pgm.createTable('post_likes', {
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
            references: 'posts',
            onDelete: 'cascade'
        },
        type: {
            type: 'varchar(8)',
            notNull: true,
            check: "type IN ('like', 'dislike')"
        }
    })
    pgm.createIndex('post_likes', 'user_id')
    pgm.createIndex('post_likes', 'entity_id')

    pgm.sql(`
        INSERT INTO post_likes (user_id, entity_id, type) VALUES
        (1, 1, 'like'),
        (2, 1, 'like'),
        (3, 2, 'dislike'),
        (4, 3, 'like'),
        (5, 4, 'like'),
        (1, 5, 'dislike'),
        (2, 5, 'like'),
        (3, 5, 'like'),
        (4, 2, 'dislike'),
        (5, 1, 'like');
    `)
};

exports.down = (pgm) => {
    pgm.dropTable('post_likes')
};
