import Joi from "joi"

export const registerSchema = Joi.object({
    login: Joi.string()
        .min(2)
        .max(32)
        .pattern(/^(?=.*[a-zA-Z])[a-zA-Z0-9._]*$/)
        .required()
        .description('Unique username')
        .messages({
            'string.min': 'Login must be at least 2 characters long.',
            'string.max': 'Login must be at most 32 characters long.',
            'string.pattern.base': 'Login must contain at least one letter and can include numbers, dots (.), and underscores (_).',
            'any.required': 'Login is a required field.',
        }),

    password: Joi.string()
        .min(8)
        .max(64)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/)
        .required()
        .description('User\'s password')
        .messages({
            'string.min': 'Password must be at least 8 characters long.',
            'string.max': 'Password must be at most 64 characters long.',
            'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, and one number.',
            'any.required': 'Password is a required field.',
        }),

    email: Joi.string()
        .email()
        .max(255)
        .required()
        .description('Email address of the user')
        .messages({
            'string.email': 'Email must be a valid email address.',
            'string.max': 'Email must be at most 255 characters long.',
            'any.required': 'Email is a required field.',
        }),
}).required()

export const passwordResetUpdateSchema = Joi.object({
    token: Joi.string()
        .required(),

    password: Joi.string()
        .min(8)
        .max(64)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/)
        .required()
        .description('User\'s password')
        .messages({
            'string.min': 'Password must be at least 8 characters long.',
            'string.max': 'Password must be at most 64 characters long.',
            'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, and one number.',
            'any.required': 'Password is a required field.',
        }),
}).required()
