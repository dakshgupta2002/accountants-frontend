import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import './config/db.js';

const PORT = process.env.PORT;
const app = express();
app.use(cors());
app.use(express.json());

import userRouter from './routers/userRouter.js';
import allotmentRouter from './routers/allotmentRouter.js';

//register or login a new user
app.use('/user', userRouter);
app.use('/allotment', allotmentRouter);

app.get('/', (req, res, next) => {
    res.end("Welcome to The Accountants server!")
})
app.listen(PORT, () => {
    console.log(`Hello Backend on port ${PORT}`);
});