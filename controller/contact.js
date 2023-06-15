const ErrorResponse = require("../utils/errorResponse");
const Contact = require("../model/contact");

const logger  = require("../utils/logger");

//post 
exports.post = async (req, res, next) => {
	const { email, fullname, subject, message} = req.body

	try {
		if(!email){
			return next(new ErrorResponse("Email is required", 400))
		}
		
		if(!fullname){
			return next(new ErrorResponse("Fullname is required", 400))
		}

		if(!subject){
			return next(new ErrorResponse("Subject is required", 400))
		}

		if(!message){
			return next(new ErrorResponse("Message is required", 400))
		}

		const contact = await Contact.create({ email, fullname, subject, message})

		if(!contact){
			return next(new ErrorResponse("Something went wrong while parsing contact message", 400))
		}

		res.status(201).json({
			success: true,
			contact,
		})

	} catch (error) {
		next(error)
	}
}

//fetch
exports.fetchAll = async (req, res, next) => {
	try {
		const contactings = await Contact.find({}).sort({createdAt: -1})

		if(!contactings){
			return next(new ErrorResponse("Something went wrong while fetching contacts", 400))
		}

		res.status(200).json({
			success: true,
			data: contactings
		})

	} catch (error) {
		next(error)
	}
}


//delete
exports.deleteContact = async (req, res, next) => {
	const { id } = req.params

	try {
		const contact = await Contact.findById(id)

		if(!contact){
			return next(new ErrorResponse("This contact message does not exist", 404))
		}

		await contact.remove()
		await contact.save()

		res.status(200).json({
			success: true,
			data: contact
		})

	} catch (error) {
		next(error)
	}
}