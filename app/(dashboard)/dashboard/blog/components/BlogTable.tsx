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
import { Separator } from "@/components/ui/separator";
import ConfirmationAlert from "@/components/common/ConfirmationAlert";
import { toast } from "sonner";
import Pagination from "@/type/pagination/Pagination";
import { useBlogStore } from "@/stores/useBlogStore";
import MediaPreview from "@/components/common/MediaPreview";
import StatusUpdateToggle from "@/components/common/StatusUpdateToggle";
import Link from "next/link";
import { usePermission } from "@/hooks/usePermission";

export default function BlogTable() {
    const {
        blogs,
        pagination,
        fetchBlog,
        loading,
        openEditModal,
        deleteBlog,
        toggleStatus
    } = useBlogStore();

    const { canEdit, canDelete } = usePermission();

    useEffect(() => {
        fetchBlog();
    }, [fetchBlog]);

    return (
        <>
            <Table>
                <TableCaption>
                    <Separator />
                    A list of <b>Blogs</b>
                </TableCaption>

                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[60px]">ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Sub Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Image</TableHead>
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
                    ) : blogs.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center">
                                No data found
                            </TableCell>
                        </TableRow>
                    ) : (
                        blogs.map((blog, index) => (
                            <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell className="font-medium">
                                    <Link
                                        href={`/dashboard/blog/${blog.slug}`} // Point to the dynamic route
                                        className="group relative overflow-hidden rounded-xl cursor-pointer"
                                        aria-label={blog.title}
                                    >
                                        {blog.title}
                                    </Link>
                                </TableCell>
                                <TableCell>{blog.subtitle ?? "-"}</TableCell>
                                <TableCell>{blog.description ?? "-"}</TableCell>
                                <TableCell>
                                    <StatusUpdateToggle
                                        id={blog.id}
                                        status={blog?.status}
                                        updateFn={toggleStatus}
                                    />
                                </TableCell>
                                <TableCell>
                                    <MediaPreview
                                        src={blog?.image}
                                        alt={blog.title}
                                        className="h-12 w-12 shadow-sm"
                                    />
                                </TableCell>
                                <TableCell>{blog.created_at ?? "-"}</TableCell>

                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        {canEdit && (
                                            <Button size="icon" variant="outline" onClick={() => openEditModal(blog)}>
                                                <Pencil size={16} />
                                            </Button>
                                        )}

                                        {canDelete && (
                                            <ConfirmationAlert
                                                title="Blog experience?"
                                                description="This blog will be permanently removed."
                                                confirmText="Delete"
                                                onConfirm={async () => {
                                                    try {
                                                        await deleteBlog(blog.id);
                                                        toast.success("Blog deleted");
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
                    onPageChange={(page) => fetchBlog(page)}
                />
            )}
        </>
    );
}
