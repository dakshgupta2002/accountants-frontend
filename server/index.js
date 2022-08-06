import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import './config/db.js';
import { corsOptions } from './config/cors';

const PORT = process.env.PORT;
const app = express();
app.use(cors({ corsOptions }));
app.use(express.json());

import userRouter from './routers/userRouter.js';
import allotmentRouter from './routers/allotmentRouter.js';

//register or login a new user
app.use('/user', userRouter);
app.use('/allotment', allotmentRouter);

app.get('/', (req, res, next) => {
    res.end("Welcome to The Accountants server!")
})

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, './client/build')))

// AFTER defining routes: Anything that doesn't match what's above, send back index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'))
})

app.listen(PORT || 5000, () => {
    console.log(`Hello Backend on port ${PORT}`);
});