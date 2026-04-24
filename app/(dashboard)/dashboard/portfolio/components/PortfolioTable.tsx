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
import {usePortfolioStore} from "@/stores/usePortfolioStore";
import {Portfolio} from "@/app/(dashboard)/dashboard/portfolio/interface/Portfolio";
import MediaPreview from "@/components/common/MediaPreview";
import { usePermission } from "@/hooks/usePermission";

export default function PortfolioTable() {
    const {
        portfolios,
        pagination,
        fetchPortfolio,
        loading,
        openEditModal,
        deletePortfolio
    } = usePortfolioStore();

    const { canEdit, canDelete } = usePermission();

    useEffect(() => {
        fetchPortfolio();
    }, [fetchPortfolio]);

    return (
        <>
            <Table>
                <TableCaption>
                    <Separator/>
                    A list of <b>Portfolio</b>
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
                    ) : portfolios.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center">
                                No data found
                            </TableCell>
                        </TableRow>
                    ) : (
                        portfolios.map((portfolio: Portfolio, index) => (
                            <TableRow key={index}>
                                <TableCell>{index+1}</TableCell>
                                <TableCell className="font-medium">
                                    {portfolio.title}
                                </TableCell>
                                <TableCell>{portfolio.sub_title ?? "-"}</TableCell>
                                <TableCell>{portfolio.project_link ?? "-"}</TableCell>
                                <TableCell>{portfolio.description ?? "-"}</TableCell>
                                <TableCell>
                                    <MediaPreview
                                        src={portfolio.media}
                                        alt={portfolio.title}
                                        className="h-12 w-12 shadow-sm"
                                    />
                                </TableCell>
                                <TableCell>{portfolio.created_at ?? "-"}</TableCell>

                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        {canEdit && (
                                            <Button size="icon" variant="outline" onClick={() => openEditModal(portfolio)}>
                                                <Pencil size={16} />
                                            </Button>
                                        )}

                                        {canDelete && (
                                            <ConfirmationAlert
                                                title="Delete portfolio?"
                                                description="This portfolio will be permanently removed."
                                                confirmText="Delete"
                                                onConfirm={async () => {
                                                    try {
                                                        await deletePortfolio(portfolio.id);
                                                        toast.success("Portfolio deleted");
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
                    onPageChange={(page) => fetchPortfolio(page)}
                />
            )}
        </>
    );
}
