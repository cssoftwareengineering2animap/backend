import { registerDecorator, ValidationOptions } from "class-validator"
import { validateBr } from "js-brasil"

interface UniqueProperty<T> {
  field: string
  entity: T
}

export const cpf = (
  validationOptions: ValidationOptions & { message: string }
) => {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: "cpf",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      async: false,
      validator: {
        validate: (value: string | number) => {
          if (!value) {
            return false
          }

          return validateBr.cpf(value)
        },
      },
    })
  }
}
