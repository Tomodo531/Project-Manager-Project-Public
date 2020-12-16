const mongoose = require('mongoose');
const User = require('./user.model');

const Schema = mongoose.Schema;

const ProjectSchema = new Schema(
	{
		op_id: { type: mongoose.Schema.Types.ObjectId, ref: 'usertemps' },
		Users: [
			{
				User: { type: mongoose.Schema.Types.ObjectId, ref: 'usertemps' },
				access: { type: Number, required: true }
			}
		],
		name: { type: String, required: true },
		deadline: { type: Date, required: true }
	},
	{
		timestamps: true
	}
);

const Projekt = mongoose.model('Projekt', ProjectSchema);

module.exports = Projekt;
