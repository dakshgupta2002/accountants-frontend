import { Router } from "express";
import Allotment from '../model/allotmentModel.js';
import { auth } from "../middlewares/auth.js";
const allotmentRouter = Router();

allotmentRouter.route('*')
    .all((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Content-Type", "application/json");
        next();
    })

allotmentRouter.route('/')
    .get(auth, async (req, res) => {
        const allotments = await Allotment.find({ userId: req.user.data }).exec();
        res.status(200).json(allotments);
    })

    .post(auth, async (req, res) => {
        const { username, allotmentDate, amountPrice, downPayment, rateInterest, penalInterest, installmentsNumber, plot, payments } = req.body;

        const allotment = new Allotment({ userId: req.user.data, username, allotmentDate, amountPrice, downPayment, rateInterest, penalInterest, installmentsNumber, plot, payments });

        await allotment.save();

        res.status(200).json(allotment);
    })
    .delete(auth, async (req, res) => {
        const allotment = await Allotment.findByIdAndDelete(req.body._id);
        res.status(200).json(allotment);
    })


export default allotmentRouter;