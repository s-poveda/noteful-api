module.exports = {
	getAllFolders(db) {
		return db('folders')
		.select()
	},
	getFolderById(db, id) {
		return db('folders')
		.select()
		.where({ id })
		.first();
	},
	insertFolder(db, folder) {
		return db('folders')
		.insert(folder)
		.returning('*');
	},
	updateFolder(db, folderId, info) {
		const { id, ...newInfo } = info;
		return db('folders')
		.update(newInfo)
		.where({ id: folderId })
		.returning('title')
	},
	deleteFolder(db, id) {
		return db('folders')
		.where({ id })
		.del();
	}
};
