ALTER TABLE notes
ADD COLUMN modified TIMESTAMPTZ DEFAULT now() NOT NULL;
