import Joi from "joi"

export const createPostSchema = Joi.object({
    title: Joi.string()
        .min(8)
        .max(255)
        .description('Title of the post')
        .required()
        .messages({
            'string.min': 'Title must be at least 8 characters long.',
            'string.max': 'Title must be at most 255 characters long.',
        }),

    content: Joi.string()
        .description('Content of the post')
        .required(),

    categories: Joi.array()
        .items(Joi.number().integer().positive())
        .description('Categories of the post')
        .required()
        .messages({
            'array.base': 'categories must be an array.',
            'array.includes': 'categories must contain only positive integers.',
        }),
}).required()

export const updatePostSchema = Joi.object({
    title: Joi.string()
        .min(8)
        .max(255)
        .description('Title of the post')
        .optional()
        .messages({
            'string.min': 'Title must be at least 8 characters long.',
            'string.max': 'Title must be at most 255 characters long.',
        }),

    content: Joi.string()
        .description('Content of the post')
        .optional(),

    isActive: Joi.boolean()
        .description('Is status active or inactive')
        .optional(),

    categoriesToDelete: Joi.array()
        .items(Joi.number().integer().positive())
        .description('Removed categories of the post')
        .optional()
        .messages({
            'array.base': 'categoriesToDelete must be an array.',
            'array.includes': 'categoriesToDelete must contain only positive integers.',
        }),

    categoriesToAdd: Joi.array()
        .items(Joi.number().integer().positive())
        .description('New categories of the post')
        .optional()
        .messages({
            'array.base': 'categoriesToAdd must be an array.',
            'array.includes': 'categoriesToAdd must contain only positive integers.',
        }),
})
