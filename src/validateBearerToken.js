const { API_TOKEN } = require('./config');
// const logger = require('./logger');

function validateBearerToken (req, res, next) {
	let submittedToken = req.get('Authorization') || '';
	submittedToken = submittedToken.split(' ')[1];
	if (!submittedToken || submittedToken !== API_TOKEN) {
		// logger.error({ message : `Unauthorized ${req.method} requested`, timestamp: req._startTime, label: req.method });
		return res.status(401).json({ error : 'Unauthorized request'});
	}
	next();
}

module.exports = validateBearerToken;
