import { ID } from "../../../../core/types/id"

export class SaveChatMessageDto {
  constructor(props: SaveChatMessageDto) {
    Object.assign(this, props)
  }

  from: ID

  to: ID

  content: string
}
