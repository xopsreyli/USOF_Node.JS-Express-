import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import CustomError from "../errors/CustomError.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../public/images/avatars'))
    },
    filename: function (req, file, cb) {
        cb(null, req.user.id + path.extname(file.originalname).toLowerCase())
    }
})

const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = fileTypes.test(file.mimetype)

    if (extname && mimetype) {
        return cb(null, true)
    } else {
        cb(new CustomError('Only image files are allowed!', 400))
    }
}

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter
})
