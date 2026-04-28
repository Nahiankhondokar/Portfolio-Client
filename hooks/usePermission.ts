/**
 * usePermission — Centralized role-based access control (RBAC) hook.
 *
 * Role definitions:
 *   1 = Super Admin  → full access (create, edit, delete, view)
 *   2 = Admin        → full access
 *   3 = User         → limited (no delete, no user management)
 *   4 = Viewer       → read-only (no create, edit, or delete)
 *
 * Usage:
 *   const { canEdit, canDelete, canCreate, isSuperAdmin } = usePermission();
 *   {canEdit && <Button onClick={openEditModal}>Edit</Button>}
 */

import { useProfileStore } from "@/stores/useProfileStore";

// Map role numbers to human-readable names for clarity
export const ROLES = {
    SUPER_ADMIN: 1,
    ADMIN: 2,
    USER: 3,
    VIEWER: 4,
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export function usePermission() {
    const profile = useProfileStore((state) => state.profile);
    const role: number = profile?.role ?? ROLES.VIEWER; // Default to most restrictive

    /** Role 1 (Super Admin) only */
    const isSuperAdmin = role === ROLES.SUPER_ADMIN;

    /** Role 1 or 2 (Admin+) */
    const isAdmin = role <= ROLES.ADMIN;

    /** Can create new records: roles 1, 2, 3 */
    const canCreate = role <= ROLES.USER;

    /** Can edit existing records: roles 1, 2, 3 */
    const canEdit = role <= ROLES.USER;

    /** Can delete records: roles 1, 2 (Super Admin & Admin) */
    const canDelete = role <= ROLES.ADMIN;

    /** Can manage users: role 1 only */
    const canManageUsers = role === ROLES.SUPER_ADMIN;

    /** Current role number */
    const currentRole = role;

    return {
        isSuperAdmin,
        isAdmin,
        canCreate,
        canEdit,
        canDelete,
        canManageUsers,
        currentRole,
    };
}
