import Joi, {ObjectSchema} from 'joi';


const signupSchema: ObjectSchema = Joi.object().keys({
  username: Joi.string().required().min(4).max(8).messages({
    'string.base': 'username must be of type string',
    'string.min': 'username should not be less than 4 characters long',
    'string.max': 'username should not exceed 8 characters',
    'string.empty': 'username is required field'
  }),
  password: Joi.string().required().min(4).max(8).messages({
    'string.base': 'password must be of type string',
    'string.min': 'password should not be less than 4 characters',
    'string.max': 'password should not exceed 8 characters',
    'string.empty': 'password is required field'
  }),
  email : Joi.string().email().required().messages({
    'string.base': 'email must be of type string',
    'string.empty': 'email is required field',
    'string.email': 'invalid email',
  }),
  avatarColor: Joi.string().required().messages({
    'any.required': 'avatar color field is required'
  }),
  avatarImage: Joi.string().required().messages({
    'any.required': 'avatar image is required field'
  })
});


export { signupSchema };
