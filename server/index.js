import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import './config/db.js';

const PORT = process.env.PORT;
const app = express();
app.options('*', cors());
app.use(express.json());

import userRouter from './routers/userRouter.js';

//register or login a new user
app.use('/user', userRouter);


app.listen(PORT, () => {
    console.log(`Hello Backend on port ${PORT}`);
});