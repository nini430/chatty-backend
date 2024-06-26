import { JoiRequestValidationError } from '@globals/helpers/error-handler';
import {Request} from 'express';
import { ObjectSchema } from 'joi';


type IJoiDecorator= (target: any, key: string, descriptor: PropertyDescriptor)=>void;



export function JoiValidator(schema: ObjectSchema): IJoiDecorator {
  return (_target: any, _key: string, descriptor: PropertyDescriptor)=>{
    const originalMethod = descriptor.value;

    descriptor.value = async function(...args: any[]) {
      const request : Request = args[0];

      const {error}= await Promise.resolve(schema.validate(request.body));
      if(error?.details) {
        throw new JoiRequestValidationError(error?.details[0].message);
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
