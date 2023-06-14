const User = require("../model/user");

const sendEmail = require("../utils/sendMail");
const ErrorResponse = require("../utils/errorResponse");
const logger  = require("../utils/logger");

const { generatePassword } = require("../middleware/password");
const { issueJWT } = require("../middleware/token");

//register controller
exports.register = async (req, res, next) => {
	let { email, fullname, telephone, location, password } = req.body

	try { 
		if(!email){
			return next(new ErrorResponse("Your email is required", 400))
		}

		if(!fullname){
			return next(new ErrorResponse("Your fullname is required", 400))
		}

		if(!location){
			return next(new ErrorResponse("Your location is required", 400))
		}

		if(!password){
			return next(new ErrorResponse("Your password is required", 400))
		}
		

		//checking if this user exists
		const userExist = await User.findOne({ email })

		if(userExist){
			return next(new ErrorResponse("This user exist", 400))
		}

		//generate password
		const saltHash = generatePassword(password)

		const salt = saltHash.salt
		const hash = saltHash.hash
		
		const user = new User({email, fullname, telephone, location, salt, hash})

		if(!user){
			return next(new ErrorResponse("Something went wrong when creating the user", 400))
		}

		await user.save()

		const token = issueJWT(user)

		res.status(201).json({
			success: true,
			user,
			token
		})

	} catch (error) {
		next(error)
	}
}

//custom edit error strings
const noUserError = "No user"

//edit by id controller
exports.editById = (req, res, next) => {
	const id = req.params.id
	const { email, fullname, telephone, location } = req.body

	try {
		User.findByIdAndUpdate(
			id,
			{ email, fullname, telephone, location },
			{ new: true },
			(error, user) => {
				if(!user){
					return next(new ErrorResponse(noUserError, 404))
				}

				if(error){
					return next(new ErrorResponse(error, 500))
				}

				res.status(200).json({
					success: true,
					data: user
				})
			}
		)
	} catch (error) {
		next(error)
	}
}

//get users
exports.fetchAll = async (req, res, next) => {
	try {
		const users = await User.find()

		res.status(200).json({
			success: true,
			data: users
		})
	} catch (error) {
		next(error)
	}
}

//get one user
exports.fetchOne = (req, res, next) => {
	const id = req.params.id

	try {
		User.findById(
			id,
			(error, user)=> {
				if(!user){
					return next(new ErrorResponse(noUserError, 404))
				}

				if(error){
					return next(new ErrorResponse(error, 500))
				}

				res.status(200).json({
					success: true,
					data: user
				})
			}
		)
	} catch (error) {
		next(error)
	}
}

//delete user
exports.deleteUser = (req, res, next) => {
	const id = req.params.id

	try {
		User.findByIdAndDelete(
			id,
			(error, user) => {
				if(!user){
					return next(new ErrorResponse(noUserError, 404))
				}

				if(error){
					return next(new ErrorResponse(error, 500))
				}

				res.status(200).json({
					success: true,
					data: "User deleted"
				})				
			}
		)
	} catch (error) {
		next(error)
	}
}