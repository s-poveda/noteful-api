TRUNCATE TABLE folders RESTART IDENTITY CASCADE;
INSERT INTO folders (id, name)
VALUES
(1, 'folder 1'),
(4, 'folder 4'),
(9, 'folder 9'),
(16, 'folder 16');
