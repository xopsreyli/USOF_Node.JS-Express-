import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import { Database, Resource, getModelByName } from '@adminjs/prisma'
import { PrismaClient } from '@prisma/client'
import bcrypt from "bcrypt"
import Connect from 'connect-pg-simple'
import session from 'express-session'

const prisma = new PrismaClient()
AdminJS.registerAdapter({ Database, Resource })

const authenticate = async (identifier, password) => {
    const user = await prisma.users.findFirst({ where: {
            OR: [
                { email: identifier },
                { login: identifier },
            ]
        }})

    if (!user) {
        return null
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        return null
    }

    return Promise.resolve(user)
}

const adminOptions = {
    resources: [
        {
            resource: { model: getModelByName('users'), client: prisma },
            options: {},
        },
        {
            resource: { model: getModelByName('posts'), client: prisma },
            options: {},
        },
        {
            resource: { model: getModelByName('categories'), client: prisma },
            options: {},
        },
        {
            resource: { model: getModelByName('comments'), client: prisma },
            options: {},
        },
        {
            resource: { model: getModelByName('post_likes'), client: prisma },
            options: {},
        },
        {
            resource: { model: getModelByName('comment_likes'), client: prisma },
            options: {},
        },
    ],
}

const admin = new AdminJS(adminOptions)

const ConnectSession = Connect(session)
const sessionStore = new ConnectSession({
    conObject: {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production',
    },
    tableName: 'session',
    createTableIfMissing: true,
})

export const adminPath = admin.options.rootPath
export const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
        authenticate,
        cookieName: 'adminjs',
        cookiePassword: 'sessionsecret',
    },
    null,
    {
        store: sessionStore,
        resave: true,
        saveUninitialized: true,
        secret: 'sessionsecret',
        cookie: {
            httpOnly: process.env.NODE_ENV === 'production',
            secure: process.env.NODE_ENV === 'production',
        },
        name: 'adminjs',
    }
)
