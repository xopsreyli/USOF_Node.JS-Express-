import * as repository from "../../../repositories/like/likeRepository.js"
import * as commonService from "../commonService.js"
import buildLike from "../../../builders/db/buildLike.js"
import UserDTO from "../../../dto/UserDTO/UserDTO.js"
import Like from "../../../entities/Like/Like.js"
import {DISLIKE, LIKE} from "../../../enums/LikeTypeEnum.js"
import {USER} from "../../../enums/EntityTypeEnum.js"
import CustomError from "../../../errors/CustomError.js"
import {checkIfExists} from "../commonService.js";

export const getLikes = async (id, tableName) => {
    const dbResult = await repository.findAllByEntity(tableName, id)

    if (dbResult.length === 0) {
        return []
    }

    const authors = await commonService.getEntities(dbResult.map(l => l.user_id), USER)

    return dbResult.map(l => buildLike(l, new UserDTO(authors[l.user_id])))
}

export const like = async (entityId, data, user, tableName) => {
    const dbResult = await repository.findByEntityAndUser(tableName, entityId, user.id)
    if (dbResult) {
        throw new CustomError('Entity is already liked', 409)
    }

    const like = new Like(
        null,
        null,
        null,
        entityId,
        data.isLike ? LIKE : DISLIKE
    )

    await repository.add(tableName, like, user)
}

export const unlike = async (entityId, user, tableName) => {
    const dbResult = await repository.findByEntityAndUser(tableName, entityId, user.id)
    checkIfExists(dbResult, 'There was no like for this entity')

    await repository.remove(tableName, dbResult.id)
}
