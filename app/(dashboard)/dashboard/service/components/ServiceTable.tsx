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
import {useServiceStore} from "@/stores/useServiceStore";
import ConfirmationAlert from "@/components/common/ConfirmationAlert";
import {toast} from "sonner";
import MediaPreview from "@/components/common/MediaPreview";
import { usePermission } from "@/hooks/usePermission";

export default function ServiceTable() {
    const {
        services,
        pagination,
        fetchService,
        loading,
        openEditModal,
        deleteService
    } = useServiceStore();

    const { canEdit, canDelete } = usePermission();

    useEffect(() => {
        fetchService();
    }, []);

    return (
        <>
            <Table>
                <TableCaption>
                    <Separator/>
                    A list of <b>Service</b>
                </TableCaption>

                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[60px]">ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Sub Title</TableHead>
                        <TableHead>Project Link</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Media</TableHead>
                        <TableHead>Created At</TableHead>
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
                    ) : services.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center">
                                No data found
                            </TableCell>
                        </TableRow>
                    ) : (
                        services.map((service, index) => (
                            <TableRow key={index}>
                                <TableCell>{index+1}</TableCell>
                                <TableCell className="font-medium">
                                    {service.title}
                                </TableCell>
                                <TableCell>{service.sub_title ?? "-"}</TableCell>
                                <TableCell>{service.project_link ?? "-"}</TableCell>
                                <TableCell>{service.description ?? "-"}</TableCell>
                                <TableCell>
                                    <MediaPreview
                                        src={service.media}
                                        alt={service.title}
                                        className="h-12 w-12 shadow-sm"
                                    />
                                </TableCell>
                                <TableCell>{service.created_at ?? "-"}</TableCell>

                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        {canEdit && (
                                            <Button size="icon" variant="outline" onClick={() => openEditModal(service)}>
                                                <Pencil size={16} />
                                            </Button>
                                        )}

                                        {canDelete && (
                                            <ConfirmationAlert
                                                title="Delete service?"
                                                description="This service will be permanently removed."
                                                confirmText="Delete"
                                                onConfirm={async () => {
                                                    try {
                                                        await deleteService(service.id);
                                                        toast.success("Service deleted");
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
                    onPageChange={(page) => fetchService(page)}
                />
            )}
        </>
    );
}
