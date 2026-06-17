"""Create recording tables

Revision ID: c1e2d5f8a9b0
Revises: b1d7b2488d10
Create Date: 2026-06-17 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c1e2d5f8a9b0'
down_revision = 'b1d7b2488d10'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create recording_status enum type
    recording_status = sa.Enum('uploaded', 'processing', 'completed', 'failed', name='recordingstatus')
    recording_status.create(op.get_bind(), checkfirst=True)

    # Create recordings table
    op.create_table(
        'recordings',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('project_id', sa.Integer(), nullable=False),
        sa.Column('tenant_id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('duration_seconds', sa.Float(), nullable=True),
        sa.Column('file_path', sa.String(512), nullable=False),
        sa.Column('genesys_call_id', sa.String(255), nullable=True),
        sa.Column('uploaded_by', sa.Integer(), nullable=False),
        sa.Column('status', recording_status, nullable=False, server_default='uploaded'),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['project_id'], ['projects.id'], ),
        sa.ForeignKeyConstraint(['tenant_id'], ['tenants.id'], ),
        sa.ForeignKeyConstraint(['uploaded_by'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_recordings_project_id'), 'recordings', ['project_id'], unique=False)
    op.create_index(op.f('ix_recordings_tenant_id'), 'recordings', ['tenant_id'], unique=False)
    op.create_index(op.f('ix_recordings_genesys_call_id'), 'recordings', ['genesys_call_id'], unique=True)

    # Create recording_transcripts table
    op.create_table(
        'recording_transcripts',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('recording_id', sa.Integer(), nullable=False),
        sa.Column('text', sa.Text(), nullable=False),
        sa.Column('source', sa.String(50), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['recording_id'], ['recordings.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_recording_transcripts_recording_id'), 'recording_transcripts', ['recording_id'], unique=False)

    # Create recording_analysis table
    op.create_table(
        'recording_analysis',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('recording_id', sa.Integer(), nullable=False),
        sa.Column('summary', sa.Text(), nullable=False),
        sa.Column('sentiment', sa.String(20), nullable=False),
        sa.Column('agent_score', sa.Float(), nullable=False),
        sa.Column('compliance_flags', sa.JSON(), nullable=False),
        sa.Column('keywords', sa.JSON(), nullable=False),
        sa.Column('analysis_metadata', sa.JSON(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['recording_id'], ['recordings.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('recording_id')
    )
    op.create_index(op.f('ix_recording_analysis_recording_id'), 'recording_analysis', ['recording_id'], unique=True)


def downgrade() -> None:
    op.drop_index(op.f('ix_recording_analysis_recording_id'), table_name='recording_analysis')
    op.drop_table('recording_analysis')
    op.drop_index(op.f('ix_recording_transcripts_recording_id'), table_name='recording_transcripts')
    op.drop_table('recording_transcripts')
    op.drop_index(op.f('ix_recordings_genesys_call_id'), table_name='recordings')
    op.drop_index(op.f('ix_recordings_tenant_id'), table_name='recordings')
    op.drop_index(op.f('ix_recordings_project_id'), table_name='recordings')
    op.drop_table('recordings')
    
    recording_status = sa.Enum('uploaded', 'processing', 'completed', 'failed', name='recordingstatus')
    recording_status.drop(op.get_bind(), checkfirst=True)
