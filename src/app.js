import express from 'express';
import { join, dirname } from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './utils/swagger.js';
import { adminPath, adminRouter} from "./utils/adminjs.js";
import indexRouter from './routes/index.js';
import authRouter from './routes/api/authentication/authRoutes.js';
import userRouter from "./routes/api/user/userRoutes.js";
import postRouter from './routes/api/post/postRoutes.js';
import categoryRouter from './routes/api/category/categoryRoutes.js';
import commentRouter from './routes/api/comment/commentRoutes.js';
import cors from 'cors'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(logger('dev'));
app.use(adminPath, adminRouter)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, '..', 'public')));
app.use(cors({
  origin: process.env.APP_CLIENT_URL
}))

app.use('/', indexRouter);
app.use('/api/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/post', postRouter)
app.use('/api/category', categoryRouter)
app.use('/api/comment', commentRouter)

export default app;
