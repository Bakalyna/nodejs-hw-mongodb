import Joi from 'joi';

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.base': 'Username should be a string',
    'string.min': 'Username should have at least {#limit} characters',
    'string.max': 'Username should have at most {#limit} characters',
  }),
  phoneNumber: Joi.string().messages({
    'string.base': 'Phone number should be a string',
  }),
  email: Joi.string().email().messages({
    'string.base': 'Email should be a string',
    'string.email': 'Email must be a valid email address',
  }),
  isFavorite: Joi.boolean().default(false).messages({
    'boolean.base': 'Favourite status should be a boolean',
  }),
  contactType: Joi.string().valid('personal', 'home', 'work').messages({
    'string.base': 'Contact type should be a string',
    'any.only': 'Contact type must be one of [work, home, personal]',
  }),
});
