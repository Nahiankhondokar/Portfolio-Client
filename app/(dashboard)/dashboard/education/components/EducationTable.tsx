"use client";

import { useEffect } from "react";
import { useEducationStore } from "@/stores/useEducationStore";


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
import { Separator } from "@/components/ui/separator";
import ConfirmationAlert from "@/components/common/ConfirmationAlert";
import { toast } from "sonner";
import Pagination from "@/type/pagination/Pagination";
import { usePermission } from "@/hooks/usePermission";

export default function EducationTable() {
    const {
        educations,
        pagination,
        fetchEducations,
        loading,
        openEditModal,
        deleteEducation
    } = useEducationStore();

    const { canEdit, canDelete } = usePermission();

    useEffect(() => {
        fetchEducations();
    }, [fetchEducations]);

    return (
        <>
            <Table>
                <TableCaption>
                    <Separator />
                    A list of <b>Educations</b>
                </TableCaption>

                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[60px]">ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Institute</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Start</TableHead>
                        <TableHead>End</TableHead>
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
                    ) : educations.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center">
                                No data found
                            </TableCell>
                        </TableRow>
                    ) : (
                        educations.map((edu, index) => (
                            <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell className="font-medium">
                                    {edu.title}
                                </TableCell>
                                <TableCell>{edu.institute ?? "-"}</TableCell>
                                <TableCell>{edu.duration ?? "-"}</TableCell>
                                <TableCell>{edu.subject ?? "-"}</TableCell>
                                <TableCell>{edu.start_date ?? "-"}</TableCell>
                                <TableCell>{edu.end_date ?? "-"}</TableCell>

                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        {canEdit && (
                                            <Button size="icon" variant="outline" onClick={() => openEditModal(edu)}>
                                                <Pencil size={16} />
                                            </Button>
                                        )}

                                        {canDelete && (
                                            <ConfirmationAlert
                                                title="Delete education?"
                                                description="This education will be permanently removed."
                                                confirmText="Delete"
                                                onConfirm={async () => {
                                                    try {
                                                        await deleteEducation(edu.id);
                                                        toast.success("Education deleted");
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
                    onPageChange={(page) => fetchEducations(page)}
                />
            )}
        </>
    );
}
