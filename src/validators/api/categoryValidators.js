import Joi from "joi";

export const createCategorySchema = Joi.object({
    title: Joi.string()
        .min(2)
        .max(32)
        .required()
        .description('Title of the category')
        .messages({
            'string.base': 'Title must be a string.',
            'string.min': 'Title must be at list 2 characters long.',
            'string.max': 'Title must be at most 32 characters long.',
            'any.required': 'Title is a required field.',
        }),

    description: Joi.string()
        .required()
        .description('Description of the category')
        .messages({
            'string.base': 'Description must be a string.',
            'any.required': 'Description is a required field.',
        }),
}).required()

export const updateCategorySchema = Joi.object({
    title: Joi.string()
        .min(2)
        .max(32)
        .optional()
        .description('Title of the category')
        .messages({
            'string.base': 'Title must be a string.',
            'string.min': 'Title must be at list 2 characters long.',
            'string.max': 'Title must be at most 32 characters long.',
        }),

    description: Joi.string()
        .optional()
        .description('Description of the category')
        .messages({
            'string.base': 'Description must be a string.',
        }),
})
