module.exports = {
  makeTestFolders() {
    return [
      { id: 1, title: "folder 1" },
      { id: 4, title: "folder 4" },
      { id: 9, title: "folder 9" },
      { id: 16, title: "folder 16" }
    ];
  },
  makeNewFolder() {
    return {
      id: 25,
      title: "folder 25"
    };
  }
};
