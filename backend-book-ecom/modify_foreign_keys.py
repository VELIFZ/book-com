"""
This script modifies the MySQL foreign key constraints to allow reviews to remain
when books are deleted. It directly connects to the database and modifies the schema.

Run this script with:
python modify_foreign_keys.py
"""

import pymysql
from dotenv import load_dotenv
import os

def main():
    # Load environment variables
    load_dotenv()
    
    # Get database connection info from environment
    db_user = os.getenv('DB_USER', 'root')
    db_password = os.getenv('DB_PASSWORD', 'password')
    db_host = os.getenv('DB_HOST', 'localhost')
    db_name = os.getenv('DB_NAME', 'ecom')
    
    print(f"Connecting to database {db_name} on {db_host}...")
    
    # Connect to the database
    try:
        conn = pymysql.connect(
            host=db_host,
            user=db_user,
            password=db_password,
            database=db_name
        )
        
        print("Connected successfully!")
        
        # Create a cursor
        cursor = conn.cursor()
        
        # Check if the foreign key constraint exists
        print("Checking for foreign key constraint on reviews table...")
        cursor.execute("""
            SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
            WHERE TABLE_SCHEMA = %s 
            AND TABLE_NAME = 'reviews' 
            AND COLUMN_NAME = 'book_id' 
            AND REFERENCED_TABLE_NAME = 'books'
        """, (db_name,))
        
        constraint = cursor.fetchone()
        
        if not constraint:
            print("Foreign key constraint not found!")
            return
            
        constraint_name = constraint[0]
        print(f"Found constraint: {constraint_name}")
        
        # Drop the existing foreign key constraint
        print(f"Dropping foreign key constraint {constraint_name}...")
        cursor.execute(f"ALTER TABLE reviews DROP FOREIGN KEY {constraint_name}")
        
        # Create a new foreign key constraint with ON DELETE SET NULL
        print("Creating new foreign key constraint with ON DELETE SET NULL...")
        cursor.execute("""
            ALTER TABLE reviews 
            ADD CONSTRAINT reviews_book_id_fk 
            FOREIGN KEY (book_id) REFERENCES books(id) 
            ON DELETE SET NULL
        """)
        
        # Verify the changes
        print("Verifying the changes...")
        cursor.execute("""
            SELECT TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME, REFERENCED_TABLE_NAME, 
                   DELETE_RULE
            FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS r
            JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE k USING(CONSTRAINT_NAME)
            WHERE TABLE_SCHEMA = %s 
            AND TABLE_NAME = 'reviews' 
            AND COLUMN_NAME = 'book_id'
        """, (db_name,))
        
        new_constraint = cursor.fetchone()
        
        if new_constraint:
            print("Foreign key constraint updated successfully!")
            print(f"Table: {new_constraint[0]}")
            print(f"Column: {new_constraint[1]}")
            print(f"Constraint: {new_constraint[2]}")
            print(f"Referenced Table: {new_constraint[3]}")
            print(f"Delete Rule: {new_constraint[4]}")
        else:
            print("Failed to update foreign key constraint!")
            
        # Commit the changes
        conn.commit()
        print("Changes committed to the database.")
        
    except Exception as e:
        print(f"Error: {str(e)}")
    finally:
        try:
            cursor.close()
            conn.close()
            print("Database connection closed.")
        except:
            pass

if __name__ == "__main__":
    main() 