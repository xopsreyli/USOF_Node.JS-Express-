const bcrypt = require('bcrypt')

exports.up = async (pgm) => {
    pgm.createTable('users', {
        id: 'id',
        login: {
            type: 'varchar(32)',
            notNull: true,
            unique: true,
        },
        password: {
            type: 'varchar(64)',
            notNull: true,
        },
        full_name: {
            type: 'varchar(255)',
        },
        email: {
            type: 'varchar(255)',
            notNull: true,
            unique: true,
        },
        profile_picture: {
            type: 'varchar(255)',
        },
        rating: {
            type: 'integer',
            notNull: true,
            default: 0,
        },
        role: {
            type: 'varchar(32)',
            notNull: true,
            default: 'user',
            check: "role IN ('user', 'admin')",
        },
        theme: {
            type: 'varchar(16)',
            notNull: true,
            default: 'dark',
            check: "theme IN ('dark', 'light')"
        },
        color_schema: {
            type: 'varchar(16)',
            notNull: true,
            default: 'green',
            check: "color_schema IN ('red', 'orange', 'yellow', 'green', 'lightblue', 'blue', 'purple', 'pink')"
        },
        refresh_token: {
            type: 'text',
        },
        is_confirmed: {
            type: 'boolean',
            notNull: true,
            default: false,
        }
    })

    const hashedPassword = await bcrypt.hash('AdminPass1234', 10)

    pgm.sql(`
        INSERT INTO users (login, password, email, role, is_confirmed) VALUES
                                                                                      ('admin', '${hashedPassword}', 'admin@gmail.com', 'admin', true),
                                                                                      ('user1', '${hashedPassword}', 'user1@gmail.com', 'user', true),
                                                                                      ('user2', '${hashedPassword}', 'user2@gmail.com', 'user', true),
                                                                                      ('user3', '${hashedPassword}', 'user3@gmail.com', 'user', true),
                                                                                      ('user4', '${hashedPassword}', 'user4@gmail.com', 'user', true)
    `)
};

exports.down = (pgm) => {
    pgm.dropTable('users')
};
