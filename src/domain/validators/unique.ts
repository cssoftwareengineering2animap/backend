import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from "class-validator"

interface UniqueProperty<T> {
  field: string
  entity: T
}

export const unique = <T>(
  property: UniqueProperty<T>,
  validationOptions: ValidationOptions & { message: string }
) => {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: "unique",
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      async: true,
      validator: {
        validate: <T>(value: T, args: ValidationArguments) => {
          const { field, entity } = args.constraints[0]

          return entity.findOne({ [field]: value }).then(value => !value)
        },
      },
    })
  }
}
