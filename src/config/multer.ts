import crypto from "crypto"
import { Request } from "express"
import multer, { FileFilterCallback, Options } from "multer"
import path from "path"
import { File } from "../domain/entities/file_entity"

const megaBytes = (quantity: number) => quantity * 1024 * 1024
const dest = path.resolve(__dirname, "..", "..", "public")

export const multerConfig: Options = {
  dest,
  storage: multer.diskStorage({
    destination: (_request, _file, callback) => callback(null, dest),
    filename: (_request, file, callback) =>
      callback(
        null,
        `${crypto.randomBytes(32).toString("hex")}_${file.originalname}`
      ),
  }),
  limits: {
    fileSize: megaBytes(2),
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fileFilter: (_request: Request, file: any, callback: FileFilterCallback) => {
    if (File.isMimeAllowed(file.mimetype)) {
      return callback(null, true)
    }

    return callback(new Error(`${file.mimetype} is not accepted`))
  },
}
