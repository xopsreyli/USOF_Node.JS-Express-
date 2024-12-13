import Joi from 'joi'

export const createUserSchema = Joi.object({
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

  isAdmin: Joi.boolean()
    .required()
    .description('Indicates if the user has admin privileges')
    .messages({
      'any.required': 'isAdmin is a required field.',
    }),
}).required()

export const updateUserProfilePictureSchema = Joi.object({
  memeType: Joi.string()
    .valid('image/png', 'image/jpeg', 'image/jpg')
    .required()
    .description('The profile picture must be of type PNG, JPEG, or JPG.')
    .messages({
      'any.only': 'Profile picture must be in PNG, JPEG, or JPG format.',
      'any.required': 'Profile picture is a required field.',
    }),
  size: Joi.number()
    .max(5 * 1024 * 1024)
    .required()
    .description('The image size must not exceed 5 MB.')
    .messages({
      'number.max': 'Image size must not exceed 5 MB.',
      'any.required': 'Image size is a required field.',
    }),
}).required()

export const updateUserSchema = Joi.object({
  login: Joi.string()
    .min(2)
    .max(32)
    .pattern(/^(?=.*[a-zA-Z])[a-zA-Z0-9._]*$/)
    .optional()
    .description('Unique username')
    .messages({
      'string.min': 'Login must be at least 2 characters long.',
      'string.max': 'Login must be at most 32 characters long.',
      'string.pattern.base': 'Login must contain at least one letter and can include numbers, dots (.), and underscores (_).',
    }),

  password: Joi.string()
    .min(8)
    .max(64)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/)
    .optional()
    .description('User\'s password')
    .messages({
      'string.min': 'Password must be at least 8 characters long.',
      'string.max': 'Password must be at most 64 characters long.',
      'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, and one number.',
    }),

  fullName: Joi.string()
    .min(2)
    .max(255)
    .pattern(/^[a-zA-Z\s'-]+$/)
    .optional()
    .description('Full name must contain at least a first and last name, using only letters, spaces, hyphens, and apostrophes.')
    .messages({
      'string.min': 'Full name must be at least 2 characters long.',
      'string.max': 'Full name must be at most 255 characters long.',
      'string.pattern.base': 'Full name can only contain letters, spaces, hyphens, and apostrophes.',
      'any.required': 'Full name is a required field.',
    }),

  email: Joi.string()
    .email()
    .max(255)
    .optional()
    .description('Email address of the user')
    .messages({
      'string.email': 'Email must be a valid email address.',
      'string.max': 'Email must be at most 255 characters long.',
    }),

  resetProfilePicture: Joi.boolean()
    .optional()
    .description('Indicates to reset user\'s profile picture or not'),

  isAdmin: Joi.boolean()
    .optional()
    .description('Indicates if the user has admin privileges'),

  theme: Joi.string()
    .optional()
    .description('Theme mode of the user'),

  colorSchema: Joi.string()
    .optional()
    .description('Color schema of the user'),
})
