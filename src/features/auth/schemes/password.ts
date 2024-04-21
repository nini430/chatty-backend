import Joi, {ObjectSchema} from 'joi';


const emailSchema : ObjectSchema = Joi.object().keys({
  email : Joi.string().required().email().messages({
    'string.base': 'email must be of type string',
    'string.required': 'email is required field',
    'string.email': 'invalid email'
  })
});

const passwordSchema: ObjectSchema = Joi.object().keys({
  'password': Joi.string().required().min(4).max(8).messages({
    'string.base': 'password must be of type string',
    'string.min': 'password should not be less than 4 characters',
    'string.max': 'password should not exceed 8 characters',
    'string.empty': 'password is required field'
  }),
  confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
    'any.required': 'confirm password field is required',
    'any.only': 'passwords must match'
  })
});

export { emailSchema, passwordSchema } ;
