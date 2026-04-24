"use client";

import { useEffect } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {Separator} from "@/components/ui/separator";
import Pagination from "@/type/pagination/Pagination";
import {useUserStore} from "@/stores/useUserStore";
import {Pencil, Trash} from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfirmationAlert from "@/components/common/ConfirmationAlert";
import {toast} from "sonner";
import NoImage from "@/public/assets/img/placeholder.webp";
import Image from "next/image";
import MediaPreview from "@/components/common/MediaPreview";
import { usePermission } from "@/hooks/usePermission";

export default function UserTable() {
    const {
        users,
        pagination,
        fetchUsers,
        loading,
        openEditModal,
        deleteUser
    } = useUserStore();

    const { canEdit, canDelete } = usePermission();

    useEffect(() => {
        fetchUsers();
    }, [openEditModal]);

    return (
        <>
            <Table>
                <TableCaption>
                    <Separator/>
                    A list of <b>Users</b>
                </TableCaption>

                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[60px]">ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center">
                                Loading...
                            </TableCell>
                        </TableRow>
                    ) : users.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center">
                                No data found
                            </TableCell>
                        </TableRow>
                    ) : (
                        users.map((user, index: number) => (
                            <TableRow key={index}>
                                <TableCell>{index+1}</TableCell>
                                <TableCell className="font-medium">
                                    {user.name}
                                </TableCell>
                                <TableCell>{user.email ?? "-"}</TableCell>
                                <TableCell>{user.phone ?? "-"}</TableCell>
                                <TableCell>{user.role ?? "-"}</TableCell>
                                <TableCell>
                                    <MediaPreview
                                        src={user.image}
                                        alt={user.name}
                                        className="h-12 w-12 shadow-sm"
                                    />
                                </TableCell>

                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        {canEdit && (
                                            <Button size="icon" variant="outline" onClick={() => openEditModal(user)}>
                                                <Pencil size={16} />
                                            </Button>
                                        )}

                                        {canDelete && (
                                            <ConfirmationAlert
                                                title="Delete User?"
                                                description="This user will be permanently removed."
                                                confirmText="Delete"
                                                onConfirm={async () => {
                                                    try {
                                                        await deleteUser(user.id);
                                                        toast.success("User deleted");
                                                    } catch {
                                                        toast.error("Delete failed");
                                                    }
                                                }}
                                                trigger={
                                                    <Button size="icon" variant="destructive">
                                                        <Trash size={16} />
                                                    </Button>
                                                }
                                            />
                                        )}

                                        {!canEdit && !canDelete && (
                                            <span className="text-xs text-muted-foreground italic">View only</span>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            {/*Pagination */}
            {pagination && (
                <Pagination
                    meta={pagination}
                    onPageChange={(page) => fetchUsers(page)}
                />
            )}
        </>
    );
}
