import express from 'express';
import { registtrationUser } from '../controllers/user.controller';
const userRouter = express.Router();

userRouter.post('/registration', registtrationUser);

export default userRouter;
