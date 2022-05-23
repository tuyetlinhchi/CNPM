const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	slug: {
		type: String,
		unique: true
	},
	address: {
		type: String
	},
	performers: {
		type: String
	},
	description: {
		type: String
	},		
	date: {
		type: Date
	},	
	time: {
		type: String
	},
	fileImg: {
		type: String
	},
	created_at:  {
		type: Date
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users'
	}
})

module.exports = mongoose.model('posts', PostSchema)
