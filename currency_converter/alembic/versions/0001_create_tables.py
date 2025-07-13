"""create transactions

Revision ID: 0001
Revises: 
Create Date: 2025-07-13 21:30:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0001'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        'transactions',
        sa.Column('id', sa.Integer, primary_key=True, index=True),
        sa.Column('user_id', sa.Integer, nullable=False),
        sa.Column('from_currency', sa.String(length=3), nullable=False),
        sa.Column('to_currency', sa.String(length=3), nullable=False),
        sa.Column('from_value', sa.Float, nullable=False),
        sa.Column('to_value', sa.Float, nullable=False),
        sa.Column('rate', sa.Float, nullable=False),
        sa.Column('timestamp', sa.DateTime, nullable=False),
    )

def downgrade():
    op.drop_table('transactions')