const decode = require('jwt-decode');
const Project = require('../../models/project.model');

function validateAccess(req, res, next, accessLevel) {
	const decoded = decode(req.cookies.auth_token);
	console.log('userID', decoded._id);
	console.log(accessLevel);

	Project.exists({
		_id: req.params.projectid,
		Users: { $elemMatch: { User: decoded._id, access: { $gte: accessLevel } } }
	})
		.then((result) => {
			if (result) {
				next();
			} else {
				return res.status(401).json('Access Denied');
			}
		})
		.catch((err) => {
			console.log('Access Error');
			return res.status(500).json('Access Error');
		});
}

function authRead(req, res, next) {
	validateAccess(req, res, next, 1);
}

function authReadWrite(req, res, next) {
	validateAccess(req, res, next, 3);
}

function authAdmin(req, res, next) {
	validateAccess(req, res, next, 5);
}

function authOwner(req, res, next) {
	validateAccess(req, res, next, 7);
}

module.exports = {
	authRead,
	authReadWrite,
	authAdmin,
	authOwner
};
