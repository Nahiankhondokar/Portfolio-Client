"use client";

import { useEffect } from "react";
import { useExperienceStore } from "@/stores/useExperienceStore";


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
import ConfirmationAlert from "@/components/common/ConfirmationAlert";
import {toast} from "sonner";
import Pagination from "@/type/pagination/Pagination";
import { usePermission } from "@/hooks/usePermission";

export default function ExperienceTable() {
    const {
        experiences,
        pagination,
        fetchExperiences,
        loading,
        openEditModal,
        deleteExperience
    } = useExperienceStore();

    const { canEdit, canDelete } = usePermission();

    useEffect(() => {
        fetchExperiences();
    }, [fetchExperiences]);

    return (
        <>
            <Table>
                <TableCaption>
                    <Separator/>
                    A list of <b>Experiences</b>
                </TableCaption>

                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[60px]">ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Duration</TableHead>
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
                    ) : experiences.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center">
                                No data found
                            </TableCell>
                        </TableRow>
                    ) : (
                        experiences.map((exp, index) => (
                            <TableRow key={index}>
                                <TableCell>{index+1}</TableCell>
                                <TableCell className="font-medium">
                                    {exp.title}
                                </TableCell>
                                <TableCell>{exp.company ?? "-"}</TableCell>
                                <TableCell>{exp.duration ?? "-"}</TableCell>
                                <TableCell>{exp.start_date ?? "-"}</TableCell>
                                <TableCell>{exp.end_date ?? "-"}</TableCell>

                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        {canEdit && (
                                            <Button size="icon" variant="outline" onClick={() => openEditModal(exp)}>
                                                <Pencil size={16} />
                                            </Button>
                                        )}

                                        {canDelete && (
                                            <ConfirmationAlert
                                                title="Delete experience?"
                                                description="This experience will be permanently removed."
                                                confirmText="Delete"
                                                onConfirm={async () => {
                                                    try {
                                                        await deleteExperience(exp.id);
                                                        toast.success("Experience deleted");
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
                    onPageChange={(page) => fetchExperiences(page)}
                />
            )}
        </>
    );
}
