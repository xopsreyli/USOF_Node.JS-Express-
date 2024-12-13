exports.up = (pgm) => {
    pgm.createTable('favorites', {
        user_id: {
            type: 'integer',
            notNull: true,
            references: 'users',
            onDelete: 'cascade',
        },
        post_id: {
            type: 'integer',
            notNull: true,
            references: 'posts',
            onDelete: 'cascade'
        },
    })
    pgm.createIndex('favorites', ['user_id', 'post_id'], { unique: true })

    pgm.sql(`
        INSERT INTO favorites (user_id, post_id) VALUES
        (1, 1),
        (1, 2),
        (2, 3),
        (3, 1),
        (4, 2),
        (5, 3),
        (1, 4),
        (2, 5);
    `)
};

exports.down = (pgm) => {
    pgm.dropTable('favorites')
};
