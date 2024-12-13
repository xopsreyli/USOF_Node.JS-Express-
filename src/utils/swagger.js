import swaggerJsdoc from 'swagger-jsdoc'

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'USOF API',
            description: 'This API provides endpoints for managing the USOF system',
            version: '1.0.0',
        },
        tags: [
            {
                name: 'Authentication',
                description: 'Endpoints for authentication management',
            },
            {
                name: 'User',
                description: 'Endpoints for user management'
            },
            {
                name: 'Post',
                description: 'Endpoints for posts management'
            },
            {
                name: 'Category',
                description: 'Endpoints for categories management'
            },
            {
                name: 'Comment',
                description: 'Endpoints for comments management'
            }
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                BaseResponse: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'integer',
                            description: 'Response code status',
                            example: 0,
                        }
                    }
                },
                SuccessResponse: {
                    allOf: [
                        { $ref: '#components/schemas/BaseResponse' },
                        {
                            type: 'object',
                            properties: {
                                message: {
                                    type: 'string',
                                    description: 'Success message',
                                    example: 'Request was successful'
                                }
                            }
                        }
                    ]
                },
                ErrorResponse: {
                    allOf: [
                        { $ref: '#components/schemas/BaseResponse' },
                        {
                            type: 'object',
                            properties: {
                                status: {
                                    examples: {
                                        badRequest: { value: 400 },
                                        unauthorized: { value: 401 },
                                        forbidden: { value: 403 },
                                        notFound: { value: 404 },
                                        conflict: { value: 409 },
                                        serverError: { value: 500 },
                                    }
                                },
                                message: {
                                    type: 'string',
                                    description: 'Error message',
                                    example: 'Error message'
                                }
                            }
                        }
                    ]
                },
                RegisterRequest: {
                    type: 'object',
                    properties: {
                        login: {
                            type: 'string',
                            description: 'Unique username',
                            maxLength: 32,
                            example: 'johndoe',
                        },
                        password: {
                            type: 'string',
                            description: 'User\'s password',
                            maxLength: 64,
                            format: 'password',
                            example: 'johndoe1234'
                        },
                        email: {
                            type: 'string',
                            description: 'Email address of the user',
                            format: 'email',
                            maxLength: 255,
                            example: 'johndoe@example.com',
                        },
                    },
                    required: ['login', 'password', 'email']
                },
                ConfirmEmailRequest: {
                    type: 'object',
                    properties: {
                        token: {
                            type: 'string',
                            format: 'JWT',
                            description: 'Confirmation token',
                        },
                    },
                    required: ['token']
                },
                LoginRequest: {
                    type: 'object',
                    properties: {
                        identifier: {
                            type: 'string',
                            description: 'User\'s login or email',
                            example: 'johndoe',
                        },
                        password: {
                            type: 'string',
                            description: 'User\'s password',
                            maxLength: 64,
                            format: 'password',
                            example: 'johndoe1234'
                        },
                    },
                    required: ['identifier', 'password']
                },
                LoginResponse: {
                    allOf: [
                        { $ref: '#components/schemas/BaseResponse' },
                        {
                            type: 'object',
                            properties: {
                                tokens: {
                                    type: 'object',
                                    description: 'JWT access and refresh tokens',
                                    properties: {
                                        accessToken: {
                                            type: 'string',
                                            format: 'JWT',
                                            description: 'Access token',
                                        },
                                        refreshToken: {
                                            type: 'string',
                                            format: 'JWT',
                                            description: 'Refresh token',
                                        }
                                    }
                                }
                            }
                        }
                    ]
                },
                TokenUpdateRequest: {
                    type: 'object',
                    properties: {
                        token: {
                            type: 'string',
                            format: 'JWT',
                            description: 'User\'s refresh token',
                        },
                    },
                    required: ['token']
                },
                TokenUpdateResponse: {
                    allOf: [
                        { $ref: '#components/schemas/BaseResponse' },
                        {
                            type: 'object',
                            properties: {
                                token: {
                                    type: 'string',
                                    format: 'JWT',
                                    description: 'Updated access token',
                                }
                            }
                        }
                    ]
                },
                ResetPasswordRequest: {
                    type: 'object',
                    properties: {
                        email: {
                            type: 'string',
                            description: 'Email address of the user',
                            format: 'email',
                            maxLength: 255,
                            example: 'johndoe@example.com',
                        },
                    },
                    required: ['email',]
                },
                ResetPasswordUpdateRequest: {
                    type: 'object',
                    properties: {
                        token: {
                            type: 'string',
                            format: 'JWT',
                            description: 'Token from email link',
                        },
                        password: {
                            type: 'string',
                            description: 'User\s password',
                            maxLength: 64,
                            format: 'password',
                            example: 'johndoe1234'
                        },
                    },
                    required: ['token', 'password']
                },
                UsersInfoResponse: {
                    allOf: [
                        { $ref: '#components/schemas/BaseResponse' },
                        {
                            type: 'object',
                            properties: {
                                users: {
                                    type: 'array',
                                    description: 'Array of users',
                                    items: {
                                        $ref: '#/components/schemas/User',
                                    }
                                }
                            }
                        }
                    ]
                },
                UserInfoResponse: {
                    allOf: [
                        { $ref: '#components/schemas/BaseResponse' },
                        {
                            type: 'object',
                            properties: {
                                user: {
                                    $ref: '#components/schemas/UserDTO',
                                },
                            },
                        },
                    ]
                },
                UserPostsResponse: {
                    allOf: [
                        { $ref: '#components/schemas/BaseResponse' },
                        {
                            type: 'object',
                            properties: {
                                posts: {
                                    $ref: '#components/schemas/Post',
                                },
                            },
                        },
                    ]
                },
                CreateUserRequest: {
                    type: 'object',
                    allOf: [
                        { $ref: '#/components/schemas/RegisterRequest' }
                    ],
                    properties: {
                        isAdmin: {
                            type: 'boolean',
                            description: 'Is user admin or not',
                            example: false,
                        }
                    },
                    required: ['login', 'password', 'email', 'isAdmin']
                },
                UpdateUserAvatarRequest: {
                    type: 'object',
                    properties: {
                        profilePicture: {
                            type: 'string',
                            format: 'binary',
                            description: 'Image to upload(JPEG, JPG, PNG)',
                        }
                    },
                    required: ['profilePicture']
                },
                UpdateUserRequest: {
                    type: 'object',
                    properties: {
                        login: {
                            type: 'string',
                            description: 'Unique username',
                            maxLength: 32,
                            example: 'johndoe',
                        },
                        password: {
                            type: 'string',
                            description: 'Hashed password of the user',
                            maxLength: 64,
                            format: 'password',
                        },
                        fullName: {
                            type: 'string',
                            description: 'Full name of the user',
                            maxLength: 255,
                            example: 'John Doe',
                        },
                        email: {
                            type: 'string',
                            description: 'Email address of the user',
                            format: 'email',
                            maxLength: 255,
                            example: 'johndoe@example.com',
                        },
                        resetProfilePicture: {
                            type: 'boolean',
                            description: 'Reset user\'s avatar or not',
                            example: false
                        },
                        isAdmin: {
                            type: 'boolean',
                            description: 'Is user admin or not',
                            example: false,
                        },
                        theme: {
                            type: 'stirng',
                            description: 'Theme mode of user',
                            example: 'dark',
                        },
                        colorSchema: {
                            type: 'string',
                            description: 'Color schema of user',
                            example: 'green',
                        }
                    }
                },
                PostsInfoResponse: {
                    allOf: [
                        {
                            $ref: '#/components/schemas/BaseResponse',
                        },
                        {
                            type: 'object',
                            properties: {
                                posts: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/Post',
                                    },
                                },
                            },
                        },
                    ],
                },
                PostInfoResponse: {
                    allOf: [
                        {
                            $ref: '#/components/schemas/BaseResponse',
                        },
                        {
                            type: 'object',
                            properties: {
                                post: {
                                    type: 'object',
                                    $ref: '#/components/schemas/Post',
                                },
                            },
                        },
                    ],
                },
                CommentsOfThePostResponse: {
                    allOf: [
                        {
                            $ref: '#/components/schemas/BaseResponse',
                        },
                        {
                            type: 'object',
                            properties: {
                                comments: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/Comment',
                                    },
                                },
                            },
                        },
                    ],
                },
                AddCommentRequest: {
                    type: 'object',
                    properties: {
                        content: {
                            type: 'string',
                            description: 'Content of the comment',
                            example: 'This is a comment text.',
                        },
                    }
                },
                CategoriesOfThePostResponse: {
                    allOf: [
                        {
                            $ref: '#/components/schemas/BaseResponse',
                        },
                        {
                            type: 'object',
                            properties: {
                                categories: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/Category',
                                    },
                                },
                            },
                        },
                    ],
                },
                LikesOfThePostResponse: {
                    allOf: [
                        {
                            $ref: '#/components/schemas/BaseResponse',
                        },
                        {
                            type: 'object',
                            properties: {
                                likes: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/Like',
                                    },
                                },
                            },
                        },
                    ],
                },
                CreatePostRequest: {
                    type: 'object',
                    properties: {
                        title: {
                            type: 'string',
                            description: 'Title of the post',
                            maxLength: 255,
                            example: 'An amazing blog post',
                        },
                        content: {
                            type: 'string',
                            description: 'Content of the post',
                            example: 'This is the content of the post.',
                        },
                        categories: {
                            type: 'array',
                            description: 'List of categories associated with the post',
                            items: {
                                type: 'integer',
                                description: 'Category ID'
                            },
                            example: [ 1, 2, 3 ],
                        },
                    },
                    required: ['title', 'content', 'categories']
                },
                CreatePostResponse: {
                    allOf: [
                        {
                            $ref: '#/components/schemas/BaseResponse',
                        },
                        {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'integer',
                                    description: 'Post ID',
                                    example: 1,
                                },
                            },
                        },
                    ],
                },
                LikePostRequest: {
                    type: 'object',
                    properties: {
                        isLike: {
                            type: 'boolean',
                            description: 'Either like or dislike',
                            example: true,
                        }
                    }
                },
                UpdatePostRequest: {
                    type: 'object',
                    properties: {
                        title: {
                            type: 'string',
                            description: 'Title of the post',
                            maxLength: 255,
                            example: 'An amazing blog post',
                        },
                        content: {
                            type: 'string',
                            description: 'Content of the post',
                            example: 'This is the content of the post.',
                        },
                        isActive: {
                            type: 'boolean',
                            description: 'Is status active or inactive',
                            example: true
                        },
                        categoriesToDelete: {
                            type: 'array',
                            description: 'Removed categories of the post',
                            example: [ 1, 2 ],
                        },
                        categoriesToAdd: {
                            type: 'array',
                            description: 'New categories of the post',
                            example: [ 3, 4 ],
                        }
                    }
                },
                CategoriesResponse: {
                    allOf: [
                        {
                            $ref: '#/components/schemas/BaseResponse',
                        },
                        {
                            type: 'object',
                            properties: {
                                categories: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/Category'
                                    }
                                }
                            },
                        },
                    ],
                },
                CategoryResponse: {
                    allOf: [
                        {
                            $ref: '#/components/schemas/BaseResponse',
                        },
                        {
                            type: 'object',
                            properties: {
                                category: {
                                    $ref: '#/components/schemas/Category'
                                }
                            },
                        },
                    ],
                },
                CategoryPostsResponse: {
                    allOf: [
                        {
                            $ref: '#/components/schemas/BaseResponse',
                        },
                        {
                            type: 'object',
                            properties: {
                                posts: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/Post'
                                    }
                                }
                            },
                        },
                    ],
                },
                CreateCategoryRequest: {
                    type: 'object',
                    properties: {
                        title: {
                            type: 'string',
                            description: 'Title of the category',
                            maxLength: 32,
                            example: 'Technology',
                        },
                        description: {
                            type: 'string',
                            description: 'Description of the category',
                            example: 'Posts related to the latest advancements in technology.',
                        },
                    },
                    required: ['title', 'description']
                },
                UpdateCategoryRequest: {
                    type: 'object',
                    properties: {
                        title: {
                            type: 'string',
                            description: 'Title of the category',
                            maxLength: 32,
                            example: 'Technology',
                        },
                        description: {
                            type: 'string',
                            description: 'Description of the category',
                            example: 'Posts related to the latest advancements in technology.',
                        },
                    },
                },
                CommentResponse: {
                    allOf: [
                        {
                            $ref: '#/components/schemas/BaseResponse',
                        },
                        {
                            type: 'object',
                            properties: {
                                comment: {
                                    $ref: '#/components/schemas/Comment'
                                }
                            },
                        },
                    ],
                },
                CommentLikesResponse: {
                    allOf: [
                        {
                            $ref: '#/components/schemas/BaseResponse',
                        },
                        {
                            type: 'object',
                            properties: {
                                likes: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/Like',
                                    },
                                },
                            },
                        },
                    ],
                },
                LikeCommentRequest: {
                    type: 'object',
                    properties: {
                        isLike: {
                            type: 'boolean',
                            description: 'Like or dislike',
                            example: true,
                        }
                    },
                    required: ['isLike'],
                },
                UpdateCommentRequest: {
                    type: 'object',
                    properties: {
                        isActive: {
                            type: 'boolean',
                            description: 'Active or inactive(status)',
                            example: true,
                        },
                    },
                    required: ['isActive'],
                },
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'Unique identifier for user',
                            example: 1,
                        },
                        login: {
                            type: 'string',
                            description: 'Unique username',
                            maxLength: 32,
                            example: 'johndoe',
                        },
                        password: {
                            type: 'string',
                            description: 'Hashed password of the user',
                            maxLength: 64,
                            format: 'password',
                        },
                        fullName: {
                            type: 'string',
                            description: 'Full name of the user',
                            maxLength: 255,
                            example: 'John Doe',
                        },
                        email: {
                            type: 'string',
                            description: 'Email address of the user',
                            format: 'email',
                            maxLength: 255,
                            example: 'johndoe@example.com',
                        },
                        profilePicture: {
                            type: 'string',
                            description: 'Name of the file for profile picture',
                            maxLength: 255,
                            example: 'johndoe.png',
                        },
                        rating: {
                            type: 'integer',
                            description: 'User\'s rating',
                            example: 100
                        },
                        role: {
                            type: 'string',
                            description: 'User\'s role',
                            maxLength: 32,
                            enum: ['user', 'admin'],
                            example: 'admin',
                        },
                        theme: {
                            type: 'string',
                            description: 'User\'s theme mode',
                            example: 'dark'
                        },
                        colorSchema: {
                            type: 'string',
                            description: 'User\'s color schema',
                            example: 'green'
                        },
                        refreshToken: {
                            type: 'string',
                            description: 'JWT refresh token',
                            format: 'JWT',
                        },
                        isConfirmed: {
                            type: 'boolean',
                            description: 'Does user\'s email confirmed',
                            example: false
                        },
                    },
                },
                UserDTO: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'Unique identifier for user',
                            example: 1,
                        },
                        login: {
                            type: 'string',
                            description: 'Unique username',
                            maxLength: 32,
                            example: 'johndoe',
                        },
                        fullName: {
                            type: 'string',
                            description: 'Full name of the user',
                            maxLength: 255,
                            example: 'John Doe',
                        },
                        email: {
                            type: 'string',
                            description: 'Email address of the user',
                            format: 'email',
                            maxLength: 255,
                            example: 'johndoe@example.com',
                        },
                        profilePicture: {
                            type: 'string',
                            description: 'Name of the file for profile picture',
                            maxLength: 255,
                            example: 'johndoe.png',
                        },
                        rating: {
                            type: 'integer',
                            description: 'User\'s rating',
                            example: 100
                        },
                        role: {
                            type: 'string',
                            description: 'User\'s role',
                            maxLength: 32,
                            enum: ['user', 'admin'],
                            example: 'admin',
                        },
                        theme: {
                            type: 'string',
                            description: 'User\'s theme mode',
                            example: 'dark'
                        },
                        colorSchema: {
                            type: 'string',
                            description: 'User\'s color schema',
                            example: 'green'
                        },
                    },
                },
                Post: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'Unique identifier for the post',
                            example: 1,
                        },
                        author: {
                            $ref: '#/components/schemas/UserDTO',
                            description: 'The author of the post',
                        },
                        title: {
                            type: 'string',
                            description: 'Title of the post',
                            maxLength: 255,
                            example: 'An amazing blog post',
                        },
                        publishDate: {
                            type: 'string',
                            format: 'date',
                            description: 'Date when the post was published',
                            example: '2024-10-13',
                        },
                        status: {
                            type: 'string',
                            description: 'Status of the post',
                            enum: ['active', 'inactive'],
                            example: 'active',
                        },
                        content: {
                            type: 'string',
                            description: 'Content of the post',
                            example: 'This is the content of the post.',
                        },
                        rating: {
                            type: 'integer',
                            description: 'Post\'s rating',
                            example: 100
                        },
                        categories: {
                            type: 'array',
                            description: 'List of categories associated with the post',
                            items: {
                                $ref: '#/components/schemas/Category',
                            },
                            example: [
                                {
                                    id: 1,
                                    title: 'Technology',
                                    description: 'All about tech',
                                },
                            ],
                        },
                    },
                },
                Category: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'Unique identifier for the category',
                            example: 1,
                        },
                        title: {
                            type: 'string',
                            description: 'Title of the category',
                            maxLength: 32,
                            example: 'Technology',
                        },
                        description: {
                            type: 'string',
                            description: 'Description of the category',
                            example: 'Posts related to the latest advancements in technology.',
                        },
                        numberOfPosts: {
                            type: 'integer',
                            description: 'Number of posts related to this category',
                            example: 100
                        },
                    },
                },
                Comment: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'Unique identifier for the comment',
                            example: 1,
                        },
                        author: {
                            $ref: '#/components/schemas/UserDTO',
                            description: 'Author of the comment',
                        },
                        postId: {
                            type: 'integer',
                            description: 'ID of the post the comment is related to',
                            example: 1,
                        },
                        publishDate: {
                            type: 'string',
                            format: 'date',
                            description: 'Date the comment was published',
                            example: '2024-10-13',
                        },
                        content: {
                            type: 'string',
                            description: 'Content of the comment',
                            example: 'This is a comment text.',
                        },
                        status: {
                            type: 'string',
                            description: 'Does comment active or not',
                            example: 'active'
                        }
                    },
                },
                Like: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'Unique identifier for the like',
                            example: 1,
                        },
                        author: {
                            $ref: '#/components/schemas/UserDTO',
                            description: 'Author of the like',
                        },
                        publishDate: {
                            type: 'string',
                            format: 'date',
                            description: 'Date the like was published',
                            example: '2024-10-13',
                        },
                        entityId: {
                            type: 'integer',
                            description: 'ID of the entity (post or comment) that the like is associated with',
                            example: 1,
                        },
                        type: {
                            type: 'string',
                            description: 'Type of like, either "like" or "dislike"',
                            enum: ['like', 'dislike'],
                            example: 'like',
                        },
                    },
                },
            },
        },
        security: [
            {
                BearerAuth: []
            }
        ],
    },
    apis: ['./src/routes/api/**/*.js'],
};

export default swaggerJsdoc(options);
