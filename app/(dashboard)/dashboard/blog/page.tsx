"use client";

import BreadcrumbComponent from "@/components/common/Breadcrumb";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import BlogTable from "@/app/(dashboard)/dashboard/blog/components/BlogTable";
import { usePermission } from "@/hooks/usePermission";
import Link from "next/link";

const Blog = () => {
  const pathname = usePathname();
  const { canCreate } = usePermission();

  return (
    <div>
      <BreadcrumbComponent pathname={pathname} />
      <div>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Blogs</h1>
          {canCreate && (
            <Link href="/dashboard/blog/new">
              <Button variant={"outline"}>Add New</Button>
            </Link>
          )}
        </div>

        <BlogTable />
      </div>
    </div>
  );
};

export default Blog;
