exports.up = (pgm) => {
    pgm.createTable('comments', {
        id: 'id',
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
            onDelete: 'cascade',
        },
        publish_date: {
            type: 'date',
            notNull: true,
            default: pgm.func('current_date'),
        },
        content: {
            type: 'text',
            notNull: true,
        },
        status: {
            type: 'varchar(16)',
            notNull: true,
            default: 'active',
            check: "status IN ('active', 'inactive')",
        },
    })
    pgm.createIndex('comments', ['user_id', 'post_id'])

    pgm.sql(`
        INSERT INTO comments (user_id, post_id, content) VALUES
        (1, 1, 'Great article on technology!'),
        (2, 1, 'I found this very informative.'),
        (3, 2, 'Loved the tips on lifestyle!'),
        (4, 3, 'This travel guide is really helpful.'),
        (5, 4, 'I totally agree with this health advice!'),
        (1, 5, 'Education is key to success!');
    `)
};

exports.down = (pgm) => {
    pgm.dropTable('comments')
};
