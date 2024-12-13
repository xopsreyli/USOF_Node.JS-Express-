import * as repository from '../../../repositories/category/categoryRepository.js'
import buildCategory from "../../../builders/db/buildCategory.js"
import * as commonService from "../commonService.js"
import Category from "../../../entities/Category/Category.js"
import {getAll as getAllPostsByCategory} from '../../../services/api/post/postService.js'
import {ASC, DESC} from "../../../enums/DBSortingEnum.js";

const validateParams = params => {
    let result = {}
    const page = Number(params.page)
    result.page = page > 0 ? page : 1
    result.numberOfPosts = params.numberOfPosts === ASC ? ASC : DESC
    result.title = params.title?.length >= 3 ? params.title : null

    return result
}

export const getAll = async (params) => {
    const dbResult = await repository.findAll(null, validateParams(params))

    return dbResult.map(c => buildCategory(c))
}

export const get = async id => {
    const dbResult = await repository.findById(id)
    commonService.checkIfExists(dbResult, 'Category was not found')

    return buildCategory(dbResult)
}

export const getCategoryPosts = async (id, user, params) => {
    const postCategoryDBResult = await repository.findAllPostsRelations(id)

    if (!postCategoryDBResult) {
        return []
    }

   return getAllPostsByCategory(user, postCategoryDBResult.map(pc => pc.post_id), params)
}

export const create = async data => {
    const category = Category.create(data.title, data.description)

    await repository.add(category)
}

export const update = async (id, data) => {
    const dbResult = await repository.findById(id)
    commonService.checkIfExists(dbResult, 'Category was not found')
    const category = buildCategory(dbResult)

    category.title = data.title || category.title
    category.description = data.description || category.description

    await repository.save(category)
}

export const remove = async id => {
    const dbResult = await repository.findById(id)
    commonService.checkIfExists(dbResult, 'Category was not found')

    await repository.remove(id)
}
