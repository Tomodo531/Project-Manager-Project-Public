const Joi = require('joi');
const PasswordComplexity = require('joi-password-complexity');

function validateUser(user) {
	const userSchema = Joi.object({
		name: Joi.string().min(6).required(),
		username: Joi.string().min(6).required(),
		email: Joi.string().min(6).required().email(),
		password: PasswordComplexity({
			min: 8,
			max: 255,
			lowerCase: 1,
			upperCase: 1,
			numeric: 1,
			symbol: 1,
			requirementCount: 4
		}).required()
	});

	return userSchema.validate(user);
}

function validateProject(project) {
	const projectSchema = Joi.object({
		name: Joi.string().min(1).required(),
		deadline: Joi.date().required()
	});

	return projectSchema.validate(project);
}

function validateGroup(group) {
	const groupSchema = Joi.object({
		name: Joi.string().min(1).required(),
		assignments: Joi.array().required()
	}).unknown();

	return groupSchema.validate(group);
}

function validateAssignment(assignment) {
	const assignmentSchema = Joi.object({
		name: Joi.string().min(1).required(),
		description: Joi.string().required(),
		/*  owner: Joi.string().required(), */
		priority: Joi.number().required(),
		status: Joi.number().required(),
		deadline: Joi.date().required()
	}).unknown();

	return assignmentSchema.validate(assignment);
}

module.exports = { validateUser, validateProject, validateGroup, validateAssignment };
