import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
    DB_HOST: Joi.string().required(),
    PORT: Joi.number().default(3000),
    DB_NAME: Joi.string().required(),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DEFAULT_LIMIT: Joi.number().default(3),
})
