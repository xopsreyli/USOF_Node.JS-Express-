exports.up = (pgm) => {
    pgm.createTable('post_category', {
        post_id: {
            type: 'integer',
            notNull: true,
            references: 'posts',
            onDelete: 'cascade'
        },
        category_id: {
            type: 'integer',
            notNull: true,
            references: 'categories',
            onDelete: 'cascade',
        }
    })
    pgm.createIndex('post_category', ['post_id', 'category_id'], { unique: true })

    pgm.sql(`
        INSERT INTO post_category (post_id, category_id) VALUES
        (1, 1),  -- Post 1 related to Technology
        (1, 2),  -- Post 1 also related to Health
        (2, 3),  -- Post 2 related to Lifestyle
        (3, 4),  -- Post 3 related to Travel
        (4, 2),  -- Post 4 related to Health
        (5, 5);  -- Post 5 related to Education
    `)
};

exports.down = (pgm) => {
    pgm.dropTable('post_category')
};
