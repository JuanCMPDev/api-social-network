import multer from 'multer'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/avatars/')
  },
  filename: (req, file, cb) => {
    cb(null, `avatar-${Date.now()}${file.originalname}`)
  }
})

export const uploads = multer({ storage })
