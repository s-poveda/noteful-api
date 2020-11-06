BEGIN;
TRUNCATE TABLE notes RESTART IDENTITY CASCADE;
SELECT setval( 'notes_id_seq', 3);

INSERT INTO notes (id, title, content, folder_id)
VALUES
(1, 'first note', 'lore ipsum', 1),
(2, 'second note', 'lore ipsum2', 4),
(3, 'third note', 'lore ipsum3', 9);
COMMIT;
