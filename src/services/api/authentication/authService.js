import User from '../../../entities/User/User.js'
import bcrypt from 'bcrypt'
import { SALT_ROUNDS } from "../../../enums/BcryptEnum.js"
import * as repository from '../../../repositories/user/userRepository.js'
import jwt from 'jsonwebtoken'
import CustomError from "../../../errors/CustomError.js"
import transporter from '../../../utils/nodemailder.js'
import {ADMIN_ROLE, USER_ROLE} from "../../../enums/UserRoleEnum.js"
import buildUser from "../../../builders/db/buildUser.js"
import {checkIfExists} from "../commonService.js"

export const create = async data => {
    const role = data.isAdmin ? ADMIN_ROLE : USER_ROLE
    let user = User.create(data.login, data.password, data.email, role)
    user.password = await bcrypt.hash(user.password, SALT_ROUNDS)

    try {
        user = buildUser(await repository.add(user))
    } catch (e) {
        if (e.code === '23505') {
            throw new CustomError('User with such login or email already exists', 409)
        }

        throw new CustomError(e.message, 500)
    }

    const confirmEmailToken = jwt.sign(
        { id: user.id },
        process.env.EMAIL_CONFIRMATION_TOKEN_SECRET
    )
    const link = `${process.env.APP_CLIENT_URL}/confirm-email?token=${confirmEmailToken}`

    try {
        await transporter.sendMail({
            from: `"USOF" ${process.env.SMTP_USER}`,
            to: user.email,
            subject: 'Link to confirm email',
            html: `
                <p>Please confirm your email by clicking on the following link:</p>
                <a href="${link}">Click here!</a>
            `
        })
    } catch (e) {
        throw new CustomError('Failed to send confirmation link to user\'s email', 500)
    }
}

export const confirmEmail = async data => {
    let tokenInfo
    try {
        tokenInfo = jwt.verify(data.token, process.env.EMAIL_CONFIRMATION_TOKEN_SECRET)
    } catch (e) {
        throw new CustomError('Invalid or expired token', 401)
    }

    const userDBResult = repository.findById(tokenInfo.id)
    checkIfExists(userDBResult, "User was not found")

    await repository.confirmEmail(tokenInfo.id)
}

export const login = async data => {
    const dbResult = await repository.findByLoginOrEmail(data.identifier)

    if (!dbResult) {
        throw new CustomError('Invalid credentials', 401)
    }

    let user = buildUser(dbResult)

    if (!user.isConfirmed) {
        throw new CustomError('Email not confirmed', 403)
    }

    const isPasswordMatch = await bcrypt.compare(data.password, user.password)
    if (!isPasswordMatch) {
        throw new CustomError('Invalid credentials', 401)
    }

    const accessToken = jwt.sign(
        {
            id: user.id,
            login: user.login,
            email: user.email,
            role: user.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' }
    )
    user.refreshToken = jwt.sign(
        {
            id: user.id,
            login: user.login,
            email: user.email,
            role: user.role,
        },
        process.env.REFRESH_TOKEN_SECRET
    )

    await repository.save(user)

    return {
        accessToken: accessToken,
        refreshToken: user.refreshToken
    }
}

export const updateToken = async data => {
    let userData

    try {
        userData = jwt.verify(data.token, process.env.REFRESH_TOKEN_SECRET)
    } catch (e) {
        throw new CustomError('Invalid token', 403)
    }

    const user = buildUser(await repository.findById(userData.id))

    if (!user || user.refreshToken !== data.token) {
        throw new CustomError('Invalid token', 403)
    }

    return jwt.sign(
        {
            id: user.id,
            login: user.login,
            email: user.email,
            role: user.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' }
    )
}

export const logout = async user => {
    await repository.removeRefreshToken(user.id)
}

export const resetPassword = async data => {
    const dbResult = await repository.findByLoginOrEmail(data.email)
    checkIfExists(dbResult, 'User was not found')
    const user = buildUser(dbResult)

    const token = jwt.sign(
        { id: user.id },
        process.env.PASSWORD_RESET_TOKEN_SECRET
    )

    const link = `${process.env.APP_CLIENT_URL}/reset-password?token=${token}`

    try {
        await transporter.sendMail({
            from: `"USOF" ${process.env.SMTP_USER}`,
            to: user.email,
            subject: 'Link to reset password',
            html: `
                <p>Reset password by clicking the link:</p>
                <a href="${link}">Click here!</a>
            `
        })
    } catch (e) {
        throw new CustomError('Failed to send password reset link to user\'s email', 500)
    }
}

export const updatePassword = async data => {
    let tokenInfo
    try {
        tokenInfo = jwt.verify(data.token, process.env.PASSWORD_RESET_TOKEN_SECRET)
    } catch (e) {
        throw new CustomError('Invalid token', 403)
    }

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS)

    await repository.updatePassword(tokenInfo.id, hashedPassword)
}
