import * as repository from '../../../repositories/comment/commentRepository.js'
import * as commonService from "../commonService.js"
import buildComment from "../../../builders/db/buildComment.js"
import UserDTO from "../../../dto/UserDTO/UserDTO.js"
import {ACTIVE, INACTIVE} from "../../../enums/StatusEnum.js"
import {USER} from "../../../enums/EntityTypeEnum.js"
import Comment from '../../../entities/Comment/Comment.js'

export const getCommentsByPost = async (postId) => {
    const dbResult = await repository.findByPost(postId)

    if (dbResult.length === 0) {
        return []
    }

    const authors = await commonService.getEntities([...new Set(dbResult.map(c => c.user_id))], USER)

    return dbResult.map(c => buildComment(c, new UserDTO(authors[c.user_id])))
}

export const get = async id => {
    const dbResult = await repository.findById(id)
    commonService.checkIfExists(dbResult, 'Comment was not found')

    return buildComment(dbResult, new UserDTO(await commonService.getAuthor(dbResult.user_id)))
}

export const create = async (postId, data, user) => {
    const comment = Comment.create(postId, data.content)

    await repository.add(comment, user)
}

export const update = async (targetId, data, user) => {
    const dbResult = await repository.findById(targetId)
    commonService.checkIfExists(dbResult, 'Comment was not found')
    commonService.checkUpdateDeletePermissions(user, dbResult.user_id)

    await repository.updateStatus(targetId, data.isActive ? ACTIVE : INACTIVE)
}

export const remove = async (targetId, user) => {
    const dbResult = await repository.findById(targetId)
    commonService.checkIfExists(dbResult, 'Comment was not found')
    commonService.checkUpdateDeletePermissions(user, dbResult.user_id)

    await repository.remove(targetId)
}
