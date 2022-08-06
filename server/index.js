import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import './config/db.js';
import { corsOptions } from './config/cors';

const PORT = process.env.PORT;
const app = express();
app.use(cors( { corsOptions}));
app.use(express.json());

import userRouter from './routers/userRouter.js';
import allotmentRouter from './routers/allotmentRouter.js';

//register or login a new user
app.use('/user', userRouter);
app.use('/allotment', allotmentRouter);

app.get('/', (req, res, next) => {
    res.end("Welcome to The Accountants server!")
})

//HEROKU
if (process.env.NODE_ENV == 'production') {
    app.use(express.static('client/build'));
    const path = require('path');

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}
app.listen(PORT || 5000, () => {
    console.log(`Hello Backend on port ${PORT}`);
});