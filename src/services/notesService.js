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
	updateNote(db, NoteId, newInfo) {
		const {id, ...toBeAdded} = newInfo;

		return db('notes')
		.update(toBeAdded)
		.where({ id: noteId })
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
