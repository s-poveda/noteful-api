module.exports = {
	makeNewNote(){
		return {
			id: 4,
			name: 'brand new note',
			content: null,
			folder_id: 16
		}
	},
	makeTestNotes() {
		return [
			{
				id: 1,
				name: 'first note',
				content: 'lore ipsum',
				folder_id: 1
			},
			{
				id: 2,
				name: 'second note',
				content: 'lore ipsum2',
				folder_id: 4
			},
			{
				id: 3,
				name: 'third note',
				content: 'lore ipsum3',
				folder_id: 9
			}
		];
	}
};
