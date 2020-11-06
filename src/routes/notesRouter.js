const express = require('express');
const xss = require('xss');
const notesService = require('../services/notesService');
const validateBearerToken = require('../validateBearerToken')

const jsonBodyParser = express.json();
const notesRouter = express.Router();

notesRouter.use(['/','/:noteId'], (req, res, next) => {
	if (req.method === 'GET') return next();
	validateBearerToken(req, res, next);
});

const serializeNote = note => {
	console.log( JSON.stringify(note.content));
	return {
		id: note.id,
		folder_id: note.folder_id,
		title: xss(note.title),
		content: note.content === null ? null : xss(note.content)
	}
}

notesRouter.route('/')
	.get( async (req, res, next) => {
		try {
			let allNotes = await notesService.getAllNotes( req.app.get('db'));
			allNotes = allNotes.length ? allNotes : ['nothing found'];
			res.json(allNotes);
		} catch(e) {
			next(e);
		}
	})
	.post(jsonBodyParser, async (req, res,next) => {
		try {
			const addedNote = await notesService.insertNote(
				req.app.get('db'),
				serializeNote(req.body)
			);
			res.status(201).send(addedNote[0]);
		} catch(e) {
			next(e);
		}
	});
module.exports = notesRouter;
