module.exports = {
  makeTestFolders(db) {
		db.raw("SELECT setval('folders_id_sequence', 16, true)");
    return [
      { id: 1, title: "folder 1" },
      { id: 4, title: "folder 4" },
      { id: 9, title: "folder 9" },
      { id: 16, title: "folder 16" }
    ];
  },
  makeNewFolder(db = null) {
		if (db) {
			db.raw("SELECT setval('folders_id_sequence', 25, true);");
		}
    return {
      id: 25,
      title: "folder 25"
    };
  }
};
