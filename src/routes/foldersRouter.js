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
		title: xss(folder.title)
	}
}

foldersRouter.route('/')
	.get( async (req, res, next) => {
		const folders = await foldersService.getAllFolders(req.app.get('db'));
		res.json(folders);
	})
	.post(jsonBodyParser, async (req, res, next) => {
		let folder = serializeFolder(req.body);
		folder =  await foldersService.insertFolder(
			req.app.get('db'),
			folder
		);
		res.status(201).send(folder[0]);
	});

module.exports = foldersRouter;
