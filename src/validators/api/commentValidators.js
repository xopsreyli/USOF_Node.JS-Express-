import Joi from "joi";

export const createCommentSchema = Joi.object({
    content: Joi.string()
        .required()
        .description('Content of the comment')
        .messages({
            'string.empty': 'Content cannot be empty.',
            'any.required': 'Content is a required field.',
        }),
}).required()

export const updateCommentSchema = Joi.object({
    isActive: Joi.boolean()
        .optional()
        .description('Indicated if the status is active or inactive')
})
