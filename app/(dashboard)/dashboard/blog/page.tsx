"use client";

import BreadcrumbComponent from "@/components/common/Breadcrumb";
import { usePathname } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useBlogStore } from "@/stores/useBlogStore";
import AddNewBlog from "@/app/(dashboard)/dashboard/blog/components/AddNewBlog";
import BlogTable from "@/app/(dashboard)/dashboard/blog/components/BlogTable";
import { usePermission } from "@/hooks/usePermission";

const Blog = () => {
  const pathname = usePathname();
  const { modalOpen, openCreateModal, closeModal, mode } = useBlogStore();
  const { canCreate } = usePermission();

  return (
    <div>
      <BreadcrumbComponent pathname={pathname} />
      <div>
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Blogs</h1>
            {canCreate && (
              <Button variant={"outline"} onClick={openCreateModal}>Add New</Button>
            )}
          </div>

          <BlogTable />

          <Dialog open={modalOpen} onOpenChange={(v) => !v && closeModal()}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {mode === "create" ? "Add Blog" : "Edit Blog"}
                </DialogTitle>
              </DialogHeader>

              <AddNewBlog />
            </DialogContent>
          </Dialog>
        </>

      </div>
    </div>
  );
};

export default Blog;
