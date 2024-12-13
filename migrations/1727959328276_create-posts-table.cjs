exports.up = (pgm) => {
    pgm.createTable('posts', {
        id: 'id',
        user_id: {
            type: 'integer',
            notNull: true,
            references: 'users',
            onDelete: 'cascade',
        },
        title: {
            type: 'varchar(255)',
            notNull: true,
        },
        publish_date: {
            type: 'date',
            notNull: true,
            default: pgm.func('current_date'),
        },
        status: {
            type: 'varchar(16)',
            notNull: true,
            default: 'active',
            check: "status IN ('active', 'inactive')",
        },
        content: {
            type: 'text',
            notNull: true,
        },
        rating: {
            type: 'integer',
            notNull: true,
            default: 0,
        },
    })
    pgm.createIndex('posts', 'user_id')

    pgm.sql(`
        INSERT INTO posts (user_id, title, content) VALUES
        (1, 'Admin Post 1', 'Content of Admin Post 1'),
        (2, 'User Post 1', 'Content of User Post 1'),
        (3, 'User Post 2', 'Content of User Post 2'),
        (4, 'User Post 3', 'Content of User Post 3'),
        (5, 'User Post 4', 'Content of User Post 4')
    `)
};

exports.down = (pgm) => {
    pgm.dropTable('posts')
};
