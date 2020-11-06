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
		.insert(note)
		.returning('*');
	},
	updateFolder(db, id, newInfo) {
		return db('folders')
		.update(newInfo)
		.where({ id })
		.returning('*')
		.first();
	},
	deleteFolder(db, id) {
		return db('folders')
		.where({ id })
		.del();
	}
};
