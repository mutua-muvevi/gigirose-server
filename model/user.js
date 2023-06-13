//package imports
const mongoose = require("mongoose");

//initialization
const { Schema } = mongoose;

//schema options
const SchemaOptions =  {
	timestamps: true,
	autoIndex: false,
	collection: "User",
	optimisticConcurrency: true,
	collation: {
		locale: "en_UK",
		strength: 1
	},
	timeseries: {
		timeField: 'timestamp',
		metaField: 'metadata',
		granularity: 'hours'
	},
}

//schema
const UserSchema = new Schema({
	fullname: {
		type: String,
		minLength: [10, "Minimum length required is 10"],
		maxLength: [100, "Maximum length required for fullname is 100"],
		required: [true, "Fullname is required"]
	},
	email: {
		type: String,
		minLength: [10, "Minimum length required is 10"],
		maxLength: [100, "Maximum length required for email is 100"],
		required: [true, "Email is required"]
	},
	phone: {
		type: String,
		minLength: [10, "Minimum length required is 10"],
		maxLength: [100, "Maximum length required for email is 100"],
	},
	role: {
		type: String,
		minLength: [10, "Minimum length required is 10"],
		maxLength: [100, "Maximum length required for role is 100"],
	},
}, SchemaOptions)

//model
const User = mongoose.model("User", UserSchema);

//export
module.exports = User;