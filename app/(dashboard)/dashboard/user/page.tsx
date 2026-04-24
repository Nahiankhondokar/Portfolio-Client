"use client";

import BreadcrumbComponent from "@/components/common/Breadcrumb";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/useUserStore";
import UserTable from "@/app/(dashboard)/dashboard/user/components/UserTable";
import AddNewUser from "@/app/(dashboard)/dashboard/user/components/AddNewUser";
import { usePermission } from "@/hooks/usePermission";

const User = () => {
  const pathname = usePathname();
  const { fetchUsers, loading, error, openCreateModal, modalOpen, closeModal, mode } = useUserStore();
  const { canCreate } = usePermission();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
      <div className="p-6 space-y-6">
        <BreadcrumbComponent pathname={pathname} />

        <div className="flex items-center justify-between w-full">
          <h1 className="text-2xl font-bold">Users</h1>

          {/* The Sheet Container */}
          <Sheet open={modalOpen} onOpenChange={closeModal}>
          {canCreate && (
            <Button variant="default" onClick={openCreateModal}>
              Add User
            </Button>
          )}

            <SheetContent side="right" className="sm:max-w-[540px] overflow-y-auto">
              <SheetHeader className="mb-6">
                <SheetTitle className="uppercase font-bold text-2xl">
                  {mode === "create" ? "Add New" : "Edit"} User
                </SheetTitle>
                <SheetDescription>
                  Fill in the details below to {mode === "create" ? "create a new" : "update the"} user profile.
                </SheetDescription>
              </SheetHeader>

              {/* Your Form Component */}
              <AddNewUser />
            </SheetContent>
          </Sheet>
        </div>

        {/* User List Table */}
        <UserTable />
      </div>
  );
};

export default User;