import 'dotenv/config'
import express from 'express';
import './config/db.js';
import { auth } from './middlewares/auth.js';
import cors from 'cors';

import userRouter from './routers/userRouter.js';

const app = express();
app.options('*', cors());
app.use(express.json());

//register or login a new user
app.use('/user', userRouter);

//if user has token present, no need to ask for login 
app.use(auth);



app.listen('3333', () => {
    console.log("Hello Backend");
});