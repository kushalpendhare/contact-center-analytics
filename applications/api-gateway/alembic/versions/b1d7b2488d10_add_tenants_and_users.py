"""add_tenants_and_users

Revision ID: b1d7b2488d10
Revises: 95907c0db8d8
Create Date: 2026-06-17 18:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "b1d7b2488d10"
down_revision: Union[str, Sequence[str], None] = "95907c0db8d8"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "tenants",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.PrimaryKeyConstraint("id")
    )
    op.create_index(op.f("ix_tenants_name"), "tenants", ["name"], unique=True)

    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("full_name", sa.String(length=100), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("tenant_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["tenant_id"], ["tenants.id"]),
        sa.PrimaryKeyConstraint("id")
    )
    op.create_index(op.f("ix_users_email"), "users", ["email"], unique=True)
    op.create_index(op.f("ix_users_tenant_id"), "users", ["tenant_id"], unique=False)

    op.add_column("projects", sa.Column("tenant_id", sa.Integer(), nullable=True))
    op.execute("INSERT INTO tenants (name) VALUES ('Local Workspace')")
    op.execute(
        "UPDATE projects "
        "SET tenant_id = (SELECT id FROM tenants WHERE name = 'Local Workspace')"
    )
    op.alter_column("projects", "tenant_id", nullable=False)
    op.create_index(op.f("ix_projects_tenant_id"), "projects", ["tenant_id"], unique=False)
    op.create_foreign_key(
        "fk_projects_tenant_id_tenants",
        "projects",
        "tenants",
        ["tenant_id"],
        ["id"]
    )


def downgrade() -> None:
    op.drop_constraint("fk_projects_tenant_id_tenants", "projects", type_="foreignkey")
    op.drop_index(op.f("ix_projects_tenant_id"), table_name="projects")
    op.drop_column("projects", "tenant_id")
    op.drop_index(op.f("ix_users_tenant_id"), table_name="users")
    op.drop_index(op.f("ix_users_email"), table_name="users")
    op.drop_table("users")
    op.drop_index(op.f("ix_tenants_name"), table_name="tenants")
    op.drop_table("tenants")
