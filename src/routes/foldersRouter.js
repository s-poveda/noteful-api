const express = require('express');
const xss = require('xss');
const foldersService = require('../services/foldersService');
const validateBearerToken = require('../validateBearerToken')

const jsonBodyParser = express.json();
const foldersRouter = express.Router();

foldersRouter.use(['/','/:folderId'], (req, res, next) => {
	if (req.method === 'GET') return next();
	validateBearerToken(req, res, next);
});

const serializeFolder = folder => {
	return {
		id: folder.id,
		title: xss(note.title),
	}
}

foldersRouter.route('/')
	.get( async (req, res, next) => {
		const folders = await foldersService.getAllFolders(req.app.get('db'));
		res.json(folders);
	})
	.post( async (req, res, next) => {
		console.log(req.body);
		let folder = serializeFolder(req.body);
		folder = foldersService.insertFolder(
			req.app.get('db'),
			folder
		);
		res.status(201).send(folder);
	});

module.exports = foldersRouter;
