-- This script modifies the MySQL foreign key constraints to allow reviews to remain
-- when books are deleted. It can be run directly in MySQL.
--
-- Run this with:
-- mysql -u root -p ecom < fix_foreign_keys.sql
--

-- Step 1: Identify the foreign key constraint name
SELECT CONSTRAINT_NAME 
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'ecom' 
  AND TABLE_NAME = 'reviews' 
  AND COLUMN_NAME = 'book_id' 
  AND REFERENCED_TABLE_NAME = 'books';

-- Step 2: Drop the existing foreign key constraint
-- Replace 'reviews_ibfk_1' with the actual constraint name found above if different
ALTER TABLE reviews DROP FOREIGN KEY reviews_ibfk_1;

-- Step 3: Add a new foreign key with ON DELETE SET NULL
ALTER TABLE reviews 
ADD CONSTRAINT reviews_book_id_fk 
FOREIGN KEY (book_id) REFERENCES books(id) 
ON DELETE SET NULL;

-- Step 4: Verify the changes
SELECT TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME, REFERENCED_TABLE_NAME, 
       DELETE_RULE
FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS r
JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE k USING(CONSTRAINT_NAME)
WHERE TABLE_SCHEMA = 'ecom' 
  AND TABLE_NAME = 'reviews' 
  AND COLUMN_NAME = 'book_id';

-- Done! The database now allows deleting books while preserving reviews. 