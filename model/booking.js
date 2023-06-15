const mongoose = require("mongoose");

const { Schema } = mongoose;

//schema options
const SchemaOptions =  {
	timestamps: true,
	autoIndex: false,
	collection: "Book",
	optimisticConcurrency: true,
	timeseries: {
		timeField: 'timestamp',
		metaField: 'metadata',
		granularity: 'hours'
	},
}

const BookSchema = new Schema({
	fullname: {
		type: String,
		minLength: [5, "Minimum length required is 5"],
		maxLength: [100, "Maximum length required for fullname is 100"],
		required: [true, "Fullname is required"]
	},
	email: {
		type: String,
		minLength: [5, "Minimum length required for email is 5"],
		maxLength: [100, "Maximum length required for email is 100"],
		required: [true, "Email is required"]
	},
	telephone: {
		type: String,
		minLength: [10, "Minimum length required for telephone is 10"],
		maxLength: [100, "Maximum length required for telephone is 100"],
	},
	address: {
		type: String,
		minLength: [5, "Minimum length required is 5"],
		maxLength: [100, "Maximum length required for address is 100"],
	},
	service: {
		type: String,
		minLength: [5, "Minimum length required is 5"],
		maxLength: [100, "Maximum length required for service is 100"],
	},
}, SchemaOptions)


const Book = mongoose.model("Booking", BookSchema)

module.exports = Book
