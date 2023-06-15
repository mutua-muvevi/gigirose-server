const ErrorResponse = require("../utils/errorResponse");
const Book = require("../model/booking");

const logger  = require("../utils/logger");

//post 
exports.post = async (req, res, next) => {
	const { email, fullname, telephone, service, address } = req.body

	try {
		if(!email){
			return next(new ErrorResponse("Invalid Email", 400))
		}
		
		if(!fullname){
			return next(new ErrorResponse("Invalid Fullname", 400))
		}

		if(!telephone){
			return next(new ErrorResponse("Invalid Telephone", 400))
		}

		if(!service){
			return next(new ErrorResponse("Invalid Service", 400))
		}

		if(!address){
			return next(new ErrorResponse("Invalid Address", 400))
		}

		const book = await Book.create({ email, fullname, telephone, service, address })

		if(!book){
			return next(new ErrorResponse("Something went wrong while booking the service", 400))
		}

		res.status(201).json({
			success: true,
			book,
		})

	} catch (error) {
		next(error)
	}
}

//fetch
exports.fetchAll = async (req, res, next) => {
	try {
		const bookings = await Book.find({}).sort({createdAt: -1})

		if(!bookings){
			return next(new ErrorResponse("Something went wrong while fetching bookings", 400))
		}

		res.status(200).json({
			success: true,
			data: bookings
		})

	} catch (error) {
		next(error)
	}
}


//delete
exports.deleteBook = async (req, res, next) => {
	const { id } = req.params

	try {
		const book = await Book.findById(id)

		if(!book){
			return next(new ErrorResponse("This booking does not exist", 404))
		}

		await book.remove()
		await book.save()

		res.status(200).json({
			success: true,
			data: book
		})

	} catch (error) {
		next(error)
	}
}