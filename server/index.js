import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import './config/db.js';
import { corsOptions } from './config/cors.js';

const app = express();
app.use(cors({ corsOptions }));
app.use(express.json());

import userRouter from './routers/userRouter.js';
import allotmentRouter from './routers/allotmentRouter.js';
import salaryRouter from './routers/salaryRouter.js';

//register or login a new user
app.use('/user', userRouter);
app.use('/allotment', allotmentRouter);
app.use('/salary', salaryRouter);

// AFTER defining routes: Anything that doesn't match what's above, send back index.html
app.get('*', (req, res) => {
    res.end("This endpoint landed here! Hello to hidden world.");
})

app.listen(process.env.PORT || 5000);