-- Run once in Hostinger phpMyAdmin if media table already exists without data column.

ALTER TABLE media
  ADD COLUMN IF NOT EXISTS data LONGBLOB NULL AFTER size;

-- If your MySQL version does not support IF NOT EXISTS on columns, use:
-- ALTER TABLE media ADD COLUMN data LONGBLOB NULL AFTER size;
