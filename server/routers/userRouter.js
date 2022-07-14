import 'dotenv/config'
import { Router } from "express";
import bcrypt from "bcrypt";
import { Auth } from "two-step-auth"
import User from "../model/userModel.js";
import UserVerify from '../model/userVerify.js';
import { generateToken } from '../middlewares/jwt.js';
import jwt from 'jsonwebtoken';
const userRouter = Router();

userRouter.route('*')
	.all((req, res, next) => {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		res.header("Content-Type", "application/json");
		next();
	})

userRouter.route('/register')
	.post(async (req, res) => {
		//first save user email in userVerify 
		//send otp and if otp verified, then save user email 
		const { email } = req.body;
		const exists = await User.findOne({ email: email }).exec();


		if (exists !== null) {
			res.status(409).json({
				"msg": "User already exists",
				"status": 409
			});
			return;
		}

		//check if already an otp has been sent 
		const oldUserVerify = await UserVerify.findOne({ email: email }).exec();

		//proceed to create temporary user account 

		// 1) Create a new document 
		const userVerify = oldUserVerify===null? new UserVerify({
			email: email
		}) : oldUserVerify;

		// 2) send otp to the email
		const auth = await Auth(email, process.env.COMPANY_NAME);

		// 3) encrypt the otp and store in database
		const otp = auth.OTP;
		userVerify.otp = otp;

		userVerify.save();
		// 4) return to the user and wait for the otp to be entered
		return res.status(200).json({
			"msg": "OTP sent",
			"status": 200
		});
	})

userRouter.route('/register/verify')
	.post(async (req, res) => {

		// accept otp from the user
		const { email, otp } = req.body;

		//check if user exists in temporary db
		const userVerify = await UserVerify.findOne({ email: email }).exec();
		if (userVerify === null) {
			res.status(404).json({
				"msg": "User not found"
			});
			return;
		}
		//check if otp is correct
		if (otp !== userVerify.otp) {
			res.status(401).json({ "msg": "OTP is incorrect" });
			return;
		}

		//verify and create user account
		userVerify.verified = true;
		userVerify.save();
		return res.json({
			"msg": "OTP verified",
			"status": 200
		});
	});


userRouter.route("/register/create")
	.post(async (req, res) => {
		const { email, password } = req.body;
		if (!email || !password) {
			res.status(400).json({
				"msg": "Please provide all the details",
				"status": 400
			});
			return;
		}
		//check if this email is verified 
		const userVerify = await UserVerify.findOne({ email: email }).exec();
		if (userVerify === null || userVerify.verified === false) {
			res.status(401).json({
				"msg": "User OTP not verified"
			});
			return;
		}

		//hash the password 
		const hashedPassword = bcrypt.hashSync(password, 10);

		const user = new User({
			email: email,
			password: hashedPassword
		});

		const token = generateToken(user._id);

		user.save();

		res.status(200).json({
			token,
			"status": 200
		});
	})

userRouter.route("/login")
	.post(async (req, res) => {
		const { email, password } = req.body;
		const userFound = await User.findOne({ email: email }).exec();
		if (userFound === null) {
			return res.status(401).json({
				"msg": "User not found"
			});
		}
		if (!bcrypt.compareSync(password, userFound.password)) {
			return res.status(401).json({
				"msg": "Password incorrect"
			});
		}
		const token = generateToken(userFound._id);
		userFound.save();

		return res.json({
			token,
			"status": 200
		});

	});

userRouter.route("/removeAccount")
	.post(async (req, res) => {
		const token = req.body.token || req.query.token || req.headers.authorization;
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		//have to delete in verify by email 
		const user = await User.findById(decoded.data);

		UserVerify.deleteOne({ email: user.email }).exec();
		User.deleteOne({ _id: decoded.data }).exec();
		return res.json({
			"msg": "User account deleted",
			"status": 200
		});

	})

userRouter.route('/isAdmin')
	.post(async (req, res) => {
		const token = req.body.token || req.query.token || req.headers.authorization;
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.data);
		if (user.admin) {
			return res.json({
				"msg": "User is admin",
				"status": 200
			});
		} else {
			return res.json({
				"msg": "User is not admin",
				"status": 401
			})
		}
	})

export default userRouter;