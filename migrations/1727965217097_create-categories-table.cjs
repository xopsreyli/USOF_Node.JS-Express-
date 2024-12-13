exports.up = (pgm) => {
    pgm.createTable('categories', {
        id: 'id',
        title: {
            type: 'varchar(32)',
            notNull: true,
        },
        description: {
            type: 'text',
            notNull: true,
        },
        number_of_posts: {
          type: 'integer',
          notNull: true,
          default: 0,
        },
    })

    pgm.sql(`
        INSERT INTO categories (title, description) VALUES
        ('Technology', 'Posts related to technology and innovations.'),
        ('Health', 'Articles focusing on health and wellness topics.'),
        ('Lifestyle', 'Posts about lifestyle, fashion, and personal development.'),
        ('Travel', 'Travel stories and tips from around the world.'),
        ('Education', 'Educational resources and articles on various subjects.')
    `)
};

exports.down = (pgm) => {
    pgm.dropTable('categories')
};
