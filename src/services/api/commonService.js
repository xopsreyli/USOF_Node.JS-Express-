import CustomError from "../../errors/CustomError.js"
import * as userRepository from "../../repositories/user/userRepository.js"
import buildUser from "../../builders/db/buildUser.js"
import * as categoryRepository from "../../repositories/category/categoryRepository.js"
import buildCategory from "../../builders/db/buildCategory.js"
import {ADMIN_ROLE} from "../../enums/UserRoleEnum.js"
import {CATEGORY, USER} from "../../enums/EntityTypeEnum.js";

export const checkIfExists = (obj, message) => {
    if (!obj) {
        throw new CustomError(message, 404)
    }
}

export const checkUpdateDeletePermissions = (user, authorId) => {
    if (user.id !== authorId && user.role !== ADMIN_ROLE) {
        throw new CustomError('You do not have permission to perform this action', 403)
    }
}

export const getAuthor = async id => {
    const dbResult = await userRepository.findById(id)

    return buildUser(dbResult)
}

const entityRepository = {
    [USER]: userRepository,
    [CATEGORY]: categoryRepository,
}

const entityBuilder = {
    [USER]: buildUser,
    [CATEGORY]: buildCategory,
}

export const getEntities = async (ids, entityType) => {
    const dbResult = await entityRepository[entityType].findAll(ids)

    return dbResult.reduce((acc, entity) => {
        acc[entity.id] = entityBuilder[entityType](entity)
        return acc
    }, {})
}