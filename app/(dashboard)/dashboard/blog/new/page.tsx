"use client";

import { useRouter } from "next/navigation";
import BreadcrumbComponent from "@/components/common/Breadcrumb";
import AddNewBlog from "@/app/(dashboard)/dashboard/blog/components/AddNewBlog";
import { usePermission } from "@/hooks/usePermission";
import { useEffect } from "react";

const NewBlogPage = () => {
    const router = useRouter();
    const { canCreate } = usePermission();

    useEffect(() => {
        if (!canCreate) router.push("/dashboard/blog");
    }, [canCreate, router]);

    return (
        <div>
            <BreadcrumbComponent pathname="/dashboard/blog/new" />
            <AddNewBlog mode="create" onSuccess={() => router.push("/dashboard/blog")} />
        </div>
    );
};

export default NewBlogPage;
