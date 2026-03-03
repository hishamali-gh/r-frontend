import Joi from 'joi';

const registrationSchema = Joi.object({
    name: Joi.string()
        .max(50)
        .required()
        .messages({
            'string.empty': '*Name is required',
            'string.max': '*Name cannot exceed 50 characters',
        }),

    username: Joi.string()
        .alphanum()
        .max(30)
        .required()
        .messages({
            'string.empty': '*Username is required',
            'string.max': '*Username cannot exceed 30 characters',
        }),

    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            'string.empty': '*Email is required',
            'string.email': '*Please enter a valid email',
        }),

    password: Joi.string()
        .min(8)
        .required()
        .messages({
            'string.empty': '*Password is required',
            'string.min': '*Password must be at least 8 characters long',
        }),

    confirm_password: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .messages({
            'any.only': '*Your password inputs do not match',
            'string.empty': '*Confirm the password',
        }),
});

export default registrationSchema;
