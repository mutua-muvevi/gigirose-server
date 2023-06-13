const mongoose = require("mongoose");

const { Schema } = mongoose.Schema;

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

const BookingSchema = new Schema({

}, SchemaOptions)

