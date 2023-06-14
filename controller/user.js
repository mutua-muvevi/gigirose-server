const User = require("../model/user");

const sendEmail = require("../utils/sendMail");
const ErrorResponse = require("../utils/errorResponse");
const logger  = require("../utils/logger");

const { generatePassword, validatePassword } = require("../middleware/password");
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


exports.login = async (req, res, next) => {
	const { email, password } = req.body

	try {console.log(req.body)
		if(!email){
			return next(new ErrorResponse("Your email is required", 400))
		}
		
		if(!password){
			return next(new ErrorResponse("Your password is required", 400))
		}

		const existingUser = await User.findOne({email})

		if(!existingUser){
			return next(new ErrorResponse(invalidAuthMessage, 400))
		}

		const user = await User.findOne({email})

		const isValid = validatePassword(password, user.salt, user.hash)

		if(!isValid){
			return next(new ErrorResponse(invalidAuthMessage, 400))
		}

		const tokenObject = issueJWT(user)

		res.status(200).json({
			success: true,
			token: tokenObject.token,
			expires: tokenObject.expires
		})
	
	} catch (error) {
		next(error)
	}
}

// forgot password
exports.forgotPassword = async (req, res, next) => {
	const { email } = req.body

	if(!email){
		return next(new ErrorResponse("Your email is required", 400))
	}

	try {
		const user = await User.findOne({email})

		if(!user){
			return next(new ErrorResponse("Invalid email", 400))
		}

		const resetToken = user.genResetToken()
		user.save()

		// sending email part
		const resetUrl = `http://localhost:3000/resetpassword/${resetToken}`

		const message = `
			<h1>You have requested a password Reset</h1>
			<p>Please click this link to reset your password, If you have not request for password reset please ignore this message.</p>
			<a href=${resetUrl} clicktracking=off>
				${resetUrl}
			</a>
		`

		try {
			sendEmail({
				to: user.email,
				subject: "You requested a password reset",
				html: message
			})

			res.status(200).json({
				success: true,
				data: "The Email was sent successfully"
			})

		} catch (error) {
			user.resetPasswordToken = undefined
			user.resetPasswordExpiry = undefined

			await user.save()

			logger.error(error)
			return next(new ErrorResponse("Email couldn't be sent", 500))
		}

	} catch (error) {
		next(error)
	}
}

// resetpassword
exports.resetpassword = async (req, res, next) => {

	const password = req.body.password

	const resetToken = crypto
		.createHash("sha256")
		.update(req.params.resetToken)
		.digest("hex")
	
	try {
		if(!password){
			return next(new ErrorResponse("Your new password is required", 400))
		}

		const user = await User.findOne({
				resetPasswordToken: resetToken,
				resetPasswordExpiry: { $gt : Date.now() }
			})
		
		if(!user){
			return next(new ErrorResponse(invalidUser, 400))
		}
		// geneerating the password
		const saltAndHash = generatePassword(password)

		// updating hash and password with new values
		user.salt = saltAndHash.salt
		user.hash = saltAndHash.hash
		user.resetPasswordToken = null
		user.resetPasswordExpiry = null
		
		user.save()
		
		res.status(200).json({
			success: true,
			message: "Your password was updated successfuly"
		})

	} catch (error) {
		logger.error(error)
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