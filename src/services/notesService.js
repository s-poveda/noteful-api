// TODO: make service class
// TODO: make this an instance of service class
const notesService = {
	getAllNotes(db) {
		return db('notes')
		.select()
	},
	getNoteById(db, id) {
		return db('notes')
		.select()
		.where({ id })
		.first();
	},
	insertNote(db, note) {
		return db('notes')
		.insert(note)
		.returning('*');
	},
	updateNote(db, id, newInfo) {
		return db('notes')
		.update(newInfo)
		.where({ id })
		.returning('*')
		.first();
	},
	deleteNote(db, id) {
		return db('notes')
		.where({ id })
		.del();
	}
}

module.exports = notesService;
