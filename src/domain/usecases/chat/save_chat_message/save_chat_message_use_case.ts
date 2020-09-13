import { injectable } from "tsyringe"
import { Message } from "../../../entities/message_entity"
import { User } from "../../../entities/user_entity"
import { SaveChatMessageDto } from "./save_chat_message.dto"

@injectable()
export class SaveChatMessageUseCase {
  execute = async (data: SaveChatMessageDto) => {
    const message = Message.create({ content: data.content })

    message.from = User.create({ id: data.from })
    message.to = User.create({ id: data.to })

    await message.save()

    return message
  }
}
