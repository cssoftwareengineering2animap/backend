import { registerDecorator, ValidationOptions } from "class-validator"
import moment from "moment"

export const isFutureDate = (
  validationOptions: ValidationOptions & { message: string }
) => {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: "isFutureDate",
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      async: true,
      validator: {
        validate: (value: Date) => moment(value).isAfter(moment()),
      },
    })
  }
}
