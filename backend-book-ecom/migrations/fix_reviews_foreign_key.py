"""
Flask-Migrate migration script to fix the reviews foreign key constraint.

This migration modifies the book_id foreign key in the reviews table to use ON DELETE SET NULL,
allowing reviews to be preserved when books are deleted.

To run:
1. Make sure you're in the backend-book-ecom directory
2. Execute: flask db upgrade
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'fix_reviews_fk'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    """
    Update the foreign key to use SET NULL on delete
    """
    # Get the connection
    conn = op.get_bind()
    
    # First identify the foreign key constraint name
    result = conn.execute(
        """
        SELECT CONSTRAINT_NAME 
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
        WHERE TABLE_SCHEMA = DATABASE() 
          AND TABLE_NAME = 'reviews' 
          AND COLUMN_NAME = 'book_id' 
          AND REFERENCED_TABLE_NAME = 'books'
        """
    )
    constraint_name = result.fetchone()[0]
    
    # Drop the existing foreign key constraint
    op.execute(f"ALTER TABLE reviews DROP FOREIGN KEY {constraint_name}")
    
    # Add a new foreign key with ON DELETE SET NULL
    op.execute(
        """
        ALTER TABLE reviews 
        ADD CONSTRAINT reviews_book_id_fk 
        FOREIGN KEY (book_id) REFERENCES books(id) 
        ON DELETE SET NULL
        """
    )
    
    print("Updated foreign key constraint to use ON DELETE SET NULL")

def downgrade():
    """
    Restore the original foreign key without the ON DELETE SET NULL
    """
    # Get the connection
    conn = op.get_bind()
    
    # Drop the new foreign key constraint
    op.execute("ALTER TABLE reviews DROP FOREIGN KEY reviews_book_id_fk")
    
    # Add the original foreign key without ON DELETE SET NULL
    op.execute(
        """
        ALTER TABLE reviews 
        ADD CONSTRAINT reviews_ibfk_1
        FOREIGN KEY (book_id) REFERENCES books(id)
        """
    )
    
    print("Restored original foreign key constraint") 