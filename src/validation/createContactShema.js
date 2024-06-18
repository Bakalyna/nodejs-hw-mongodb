import Joi from 'joi';

 

export const createContactSchema = Joi.object({
    name: Joi.string().required().min(3).max(20).messages({
    'string.base': 'Username should be a string',
    'string.empty': 'The username cannot be empty',
    'string.min': 'Username should have at least 3 characters',
    'string.max': 'Username should have at most 20 characters',
    'any.required': 'Username is required',
  }),
    phoneNumber: Joi.string().required().min(3).max(20).messages({
    'number.base': 'Phone number should be a number',
    'number.min': 'Phone number should have at least 3 characters',
    'number.max': 'Phone number should have at least 20 characters',
    'any.required': 'Phone number is required',
  }) ,
  email: Joi.string().email().required().min(3).max(20).messages({
    'string.base': 'Email should be a string',
    'string.email': 'Email must be a valid email address',
    'string.min': 'Email should have at least {#limit} characters',
    'string.max': 'Email should have at most {#limit} characters',
    'any.required': 'Email is required',
  }),
    isFavorite: Joi.boolean().default(false).messages({
      'boolean.base': 'Favourite status should be a boolean',
  }),
    contactType: Joi.string().valid('personal', 'home', 'work').min(3).max(20).messages({
    'string.base': 'Contact type should be a string',
    'string.min': 'Contact should have at least {#limit} characters',
    'string.max': 'Contact should have at most {#limit} characters',
    'any.only': 'Contact type must be one of [work, home, personal]',
  })
});