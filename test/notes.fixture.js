module.exports = {
	makeNewNote(){
		return {
			id: 4,
			title: 'brand new note',
			content: null,
			folder_id: 16
		}
	},
	makeTestNotes() {
		return [
			{
				id: 1,
				title: 'first note',
				content: 'lore ipsum',
				folder_id: 1
			},
			{
				id: 2,
				title: 'second note',
				content: 'lore ipsum2',
				folder_id: 4
			},
			{
				id: 3,
				title: 'third note',
				content: 'lore ipsum3',
				folder_id: 9
			}
		];
	}
};
