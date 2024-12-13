import * as repository from '../../../repositories/user/userRepository.js'
import CustomError from "../../../errors/CustomError.js"
import UserDTO from '../../../dto/UserDTO/UserDTO.js'
import {ADMIN_ROLE, USER_ROLE} from "../../../enums/UserRoleEnum.js"
import bcrypt from "bcrypt"
import {SALT_ROUNDS} from "../../../enums/BcryptEnum.js"
import jwt from "jsonwebtoken"
import transporter from "../../../utils/nodemailder.js"
import path from 'path'
import { fileURLToPath } from 'url'
import * as fs from "fs"
import buildUser from "../../../builders/db/buildUser.js"
import * as commonService from "../commonService.js"
import {ASC, DESC} from "../../../enums/DBSortingEnum.js"
import {
    findAllByUser,
    findPostsCategoriesRelations,
} from "../../../repositories/post/postRepository.js"
import buildPost from "../../../builders/db/buildPost.js"
import {CATEGORY} from "../../../enums/EntityTypeEnum.js"
import * as favoritesRepository from '../../../repositories/favorites/favoritesRepository.js'
import {getAll as getAllPosts} from "../post/postService.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const validateParams = params => {
    let result = {}
    const page = Number(params.page)
    result.page = page > 0 ? page : 1
    result.rating = params.rating === ASC ? ASC : DESC
    result.login = params.login?.length >= 3 ? params.login : null

    return result
}

export const getAll = async (params) => {
    const dbResult = await repository.findAll(null, validateParams(params))

    return dbResult.map(u => new UserDTO(buildUser(u)))
}

export const get = async (id) => {
    const dbResult = await repository.findById(id)
    commonService.checkIfExists(dbResult, 'User was not found')

    return new UserDTO(buildUser(dbResult))
}

export const getUserPosts = async (id, params) => {
    const authorDBResult = await  repository.findById(id)
    commonService.checkIfExists(authorDBResult, 'User was not found')
    const  postsDBResult = await findAllByUser(id, validateParams(params))
    const postCategoryDBResult = await findPostsCategoriesRelations(postsDBResult.map(p => p.id))
    const categories = await commonService.getEntities(postCategoryDBResult.map(pc => pc.category_id), CATEGORY)

    return postsDBResult.map(p => buildPost(p, new UserDTO(buildUser(authorDBResult)), Object.values(categories)))
}

export const getTop = async () => {
    const usersDBResult = await repository.findTop100()

    return usersDBResult.map(u => new UserDTO(buildUser(u)))
}

export const updateAvatar = async (user, file) => {
    const userDBResult = await repository.findById(user.id)
    commonService.checkIfExists(userDBResult, 'User was not found')

    await repository.updateAvatar(user.id, file.filename)
}

export const update = async (data, user, targetId) => {
    commonService.checkUpdateDeletePermissions(user, targetId)
    let dbResult = await repository.findById(targetId)
    commonService.checkIfExists(dbResult, 'User was not found')
    let target = buildUser(dbResult)
    target.login = data.login || target.login
    target.password = data.password ? await bcrypt.hash(data.password, SALT_ROUNDS) : target.password
    target.fullName = data.fullName || target.fullName
    target.theme = data.theme || target.theme
    target.colorSchema = data.colorSchema || target.colorSchema

    if (data.email) {
        target.email = data.email
        target.isConfirmed = false

        const confirmEmailToken = jwt.sign(
            { id: target.id },
            process.env.EMAIL_CONFIRMATION_TOKEN_SECRET
        )
        const link = `${process.env.APP_CLIENT_URL}/confirm-email?token=${confirmEmailToken}`

        try {
            await transporter.sendMail({
                from: `"USOF" ${process.env.SMTP_USER}`,
                to: target.email,
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

    if (data.resetProfilePicture) {
        if (target.profilePicture) {
            const filePath = path.join(__dirname, '../../../../public/images/avatars', target.profilePicture)

            try {
                await fs.promises.unlink(filePath)
            } catch (e) {
                console.log(e)
                throw new CustomError('Failed to delete user\'s profile picture', 500)
            }

            target.profilePicture = null
        }
    }

    if (data.isAdmin !== undefined) {
        if (user.role !== ADMIN_ROLE) {
            throw new CustomError('Only admins can change role', 403)
        }

        target.role = data.isAdmin ? ADMIN_ROLE : USER_ROLE
    }

    await repository.save(target)
}

export const remove = async (targetId, user) => {
    commonService.checkUpdateDeletePermissions(user, targetId)
    const dbResult = await repository.findById(targetId)
    commonService.checkIfExists(dbResult, 'User was not found')

    await repository.remove(targetId)
}

export const getUserFavoritesPosts = async (user, params) => {
    const upDBResult = await favoritesRepository.findByUser(user)
    if (upDBResult.length === 0) {
        return []
    }

    return getAllPosts(user, upDBResult.map(up => up.post_id), params)
}
