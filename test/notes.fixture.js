module.exports = {
	makeNewNote(){
		const date = new Date('2020-11-06T05:15:41.820Z');
		return {
			id: 4,
			name: 'brand new note',
			content: null,
			folder_id: 16,
			modified: date
		}
	},
	makeTestNotes() {
		return [
			{
				id: 1,
				name: 'first note',
				content: 'lore ipsum',
				folder_id: 1,
				modified: new Date("2020-11-07T05:15:41.697Z")
			},
			{
				id: 2,
				name: 'second note',
				content: 'lore ipsum2',
				folder_id: 4,
				modified: new Date("2020-11-06T05:15:41.697Z")
			},
			{
				id: 3,
				name: 'third note',
				content: 'lore ipsum3',
				folder_id: 9,
				modified: new Date("2020-11-07T05:15:41.697Z")
			}
		];
	}
};
