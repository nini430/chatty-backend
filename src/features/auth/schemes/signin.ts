import Joi, {ObjectSchema} from 'joi';


const signinSchema : ObjectSchema = Joi.object().keys({
  username: Joi.string().required().min(4).max(8).messages({
    'string.base': 'username must be of type string',
    'string.min': 'username should not be less than 4 characters',
    'string.max': 'username should not exceed 8 characters',
    'string.empty': 'username is required field'
  }),
  password: Joi.string().required().min(4).max(8).messages({
    'string.base': 'password must be of type string',
    'string.min': 'password should not be less than 4 characters long',
    'string.max': 'password should not exceed 8 characters',
    'string.empty': 'password is required field'
  })
});

export {signinSchema};
