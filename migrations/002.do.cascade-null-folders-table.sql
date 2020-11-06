TRUNCATE notes, folders RESTART IDENTITY CASCADE;

ALTER TABLE notes
DROP COLUMN folder_id;

ALTER TABLE folders
DROP COLUMN id;

ALTER TABLE folders
ADD COLUMN id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY;

ALTER TABLE notes
ADD COLUMN folder_id INTEGER REFERENCES folders(id) ON DELETE CASCADE NOT NULL;