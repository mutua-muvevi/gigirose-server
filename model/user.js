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
	location: {
		type: String,
		minLength: [5, "Minimum length required is 5"],
		maxLength: [100, "Maximum length required for location is 100"],
	},
	
	hash: String,
	salt: String,
	
	resetPasswordToken:String,
	resetPasswordExpiry:Date,
}, SchemaOptions)

	
// generating reset token
UserSchema.methods.genResetToken = function(){
	const resetToken = crypto.randomBytes(10).toString("hex")

	this.resetPasswordToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex")
	
	this.resetPasswordExpiry = Date.now() + 240 * (60 * 1000)
	return resetToken
}

//model
const User = mongoose.model("User", UserSchema);

//export
module.exports = User;