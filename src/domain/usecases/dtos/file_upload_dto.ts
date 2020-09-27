import { IsNotEmpty, Min } from "class-validator"

export class FileUploadDto {
  constructor(props: FileUploadDto) {
    Object.assign(this, props)
  }

  @IsNotEmpty({ message: "O nome do arquivo deve ser informado" })
  name: string

  @IsNotEmpty({ message: "A chave do arquivo deve ser informada" })
  key: string

  @IsNotEmpty({ message: "A url deve ser informada" })
  url: string

  @Min(0, { message: "A ordem em que a imagem aparece deve ser informada" })
  displayOrder: number
}
