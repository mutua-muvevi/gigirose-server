const mongoose = require("mongoose");

const { Schema } = mongoose;

//schema options
const SchemaOptions =  {
	timestamps: true,
	autoIndex: false,
	collection: "Contact",
	optimisticConcurrency: true,
	timeseries: {
		timeField: 'timestamp',
		metaField: 'metadata',
		granularity: 'hours'
	},
}

const ContactSchema = new Schema({
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
	subject: {
		type: String,
		minLength: [10, "Minimum length required for subject is 10"],
		maxLength: [100, "Maximum length required for subject is 100"],
	},
	message: {
		type: String,
		minLength: [20, "Minimum length required is 20"],
		maxLength: [1000, "Maximum length required for message is 1000"],
	},
}, SchemaOptions)


const Contact = mongoose.model("Contact", ContactSchema)

module.exports = Contact
