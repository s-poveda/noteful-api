module.exports = {
  makeTestFolders(db) {
		db.raw("SELECT setval('folders_id_sequence', 16, true)");
    return [
      { id: 1, name: "folder 1" },
      { id: 4, name: "folder 4" },
      { id: 9, name: "folder 9" },
      { id: 16, name: "folder 16" }
    ];
  },
  makeNewFolder(db = null) {
		if (db) {
			db.raw("SELECT setval('folders_id_sequence', 25, true);");
		}
    return {
      id: 25,
      name: "folder 25"
    };
  }
};
