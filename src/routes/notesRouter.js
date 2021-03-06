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
	return {
		id: note.id,
		folder_id: note.folder_id,
		name: xss(note.name),
		content: note.content === null ? null : xss(note.content),
		modified: note.modified
	}
}

notesRouter.route('/')
	.get( async (req, res, next) => {
		try {
			let allNotes = await notesService.getAllNotes( req.app.get('db'));
			res.json(allNotes);
		} catch(e) {
			next();
		}
	})
	.post(jsonBodyParser, async (req, res,next) => {
		try {
			const addedNote = await notesService.insertNote(
				req.app.get('db'),
				serializeNote(req.body)
			);
			res.status(201).json(addedNote[0]);
		} catch(e) {
			console.log(e);
			next();
		}
	});

notesRouter.route('/:noteId')
	.get( async (req, res, next) => {
		try {
			const noteId = Number(req.params.noteId);
			// NaN is falsy
			if (!noteId) throw 'invalid noteId';

			const noteRes = await notesService.getNoteById(
				req.app.get('db'),
				noteId
			);
			res.json(noteRes);
		} catch (e) {
			next();
		}
	})
	.delete( async (req, res, next) => {
		try {
			const noteId = Number(req.params.noteId);
			if (!noteId) throw 'invalid note id';

			await notesService.deleteNote(
				req.app.get('db'),
				noteId
			);
			res.status(204).json({});
		} catch (e) {
			next();
		}
	})
module.exports = notesRouter;
