import Joi from "joi";

export const requestResetEmailShema = Joi.object({
    email: Joi.string().email().required(),
});