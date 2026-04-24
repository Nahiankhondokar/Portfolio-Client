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

import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import {Separator} from "@/components/ui/separator";
import Pagination from "@/type/pagination/Pagination";
import ConfirmationAlert from "@/components/common/ConfirmationAlert";
import {toast} from "sonner";
import {useExpertiseStore} from "@/stores/useExpertiseStore";
import { usePermission } from "@/hooks/usePermission";

export default function ExpertiseTable() {
    const {
        expertises,
        pagination,
        fetchExpertise,
        loading,
        openEditModal,
        deleteExpertise
    } = useExpertiseStore();

    const { canEdit, canDelete } = usePermission();

    useEffect(() => {
        fetchExpertise();
    }, [fetchExpertise]);

    return (
        <>
            <Table>
                <TableCaption>
                    <Separator/>
                    A list of <b>Expertises</b>
                </TableCaption>

                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[60px]">ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Progress</TableHead>
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
                    ) : expertises.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center">
                                No data found
                            </TableCell>
                        </TableRow>
                    ) : (
                        expertises.map((expertise, index: number) => (
                            <TableRow key={index}>
                                <TableCell>{index+1}</TableCell>
                                <TableCell className="font-medium">
                                    {expertise.name}
                                </TableCell>
                                <TableCell>{expertise.description ?? "-"}</TableCell>
                                <TableCell>{expertise.progress ?? "-"}</TableCell>

                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        {canEdit && (
                                            <Button size="icon" variant="outline" onClick={() => openEditModal(expertise)}>
                                                <Pencil size={16} />
                                            </Button>
                                        )}

                                        {canDelete && (
                                            <ConfirmationAlert
                                                title="Delete expertise?"
                                                description="This expertise will be permanently removed."
                                                confirmText="Delete"
                                                onConfirm={async () => {
                                                    try {
                                                        await deleteExpertise(expertise.id);
                                                        toast.success("Expertise deleted");
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
                    onPageChange={(page) => fetchExpertise(page)}
                />
            )}
        </>
    );
}
