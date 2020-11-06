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
		try {
			const folders = await foldersService.getAllFolders(req.app.get('db'));
			res.json(folders);
		} catch (e) {
			next();
		}
	})
	.post(jsonBodyParser, async (req, res, next) => {
		try {
			let folder = serializeFolder(req.body);
			folder =  await foldersService.insertFolder(
				req.app.get('db'),
				folder
			);
			res.status(201).send(folder[0]);
		} catch (e) {
			next();
		}
	});

foldersRouter.route('/:folderId')
	.delete( async (req, res, next) => {
		try {
			const { folderId } = req.params;
			await foldersService.deleteFolder(
				req.app.get('db'),
				folderId
			);
			res.sendStatus(204);
		} catch (e) {
			next();
		}
	})
	.patch( jsonBodyParser, async (req, res, next)=> {
		try {
			let { id, ...updatedInfo } = serializeFolder(req.body);
			id = req.params.folderId;
			console.log('id', id);
			const newFolderTitle = await foldersService.updateFolder(
				req.app.get('db'),
				id,
				updatedInfo
			);
			res
				.status(206)
				.json(newFolderTitle[0]);
		} catch (e) {
			console.log(e);
			next();
		}
	});
module.exports = foldersRouter;
