import path from 'path'
import * as multer from 'fastify-multer'
import { FastifyRequest } from 'fastify'
import { randomBytes } from 'node:crypto'

export const multerConfig = {
  dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads'))
    },
    filename: (req, file, cb) => {
      randomBytes(16, (err, hash) => {
        if (err) throw new Error(`${err.message}`)

        const fileName = `${hash.toString('hex')}-${file.originalname}`
        cb(null, fileName)
      })
    },
  }),
  limits: {
    fileSize: 20 * 1024 * 1024,
    fileFilter: (
      req: FastifyRequest,
      file: { mimetype: string },
      cb: (error: Error | null, acceptFile: boolean) => void,
    ) => {
      const allowedMines = ['images/jpg', 'images/jpeg', 'images/pdf']

      if (allowedMines.includes(file.mimetype)) {
        cb(null, true)
      } else {
        cb(new Error('Invalid file type.'), false)
      }
    },
  },
}
