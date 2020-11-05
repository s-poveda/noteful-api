module.exports = {
	makeNewNote(){
		return {
			title: 'brand new note',
			content: null
			folder_id: 1
		}
	},
	makeTestNotes() {
		return [
			{
				title: 'first note',
				content: 'lore ipsum'
				folder_id: 1
			},
			{
				title: 'second note',
				content: 'lore ipsum2'
				folder_id: 2
			},
			{
				title: 'third note',
				content: 'lore ipsum3'
				folder_id: 3
			}
		];
	}
};
