const express = require('express');
const notesService = require('../services/notesService');

const jsonBodyParser = express.json();
const notesRouter = express.Router();

notesRouter.use(['/','/:noteId'], (req, res, next) => {
	if (req.method === 'GET') return next();
	validateBearerToken(req, res, next);
});

notesRouter.route('/')
	.get( async (req, res, next) => {
		const allNotes = await notesService.getAllNotes( req.get('db'))
		res.json(allNotes);
	})
	.post( (req, res,next) => {

	})
module.exports = notesRouter;
