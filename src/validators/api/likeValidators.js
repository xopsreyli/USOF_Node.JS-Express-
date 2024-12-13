import Joi from "joi";

export const createLikeSchema = Joi.object({
    isLike: Joi.boolean()
        .required()
        .description('Indicates whether object is like or dislike')
        .messages({
            'boolean.base': 'isLike must be a boolean value.',
            'any.required': 'isLike is a required field.'
        }),
}).required()
