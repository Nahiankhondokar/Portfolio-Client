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
import {useExpertiseStore} from "@/stores/useExpertiseStore";
import AddNewExpertise from "@/app/(dashboard)/dashboard/expertise/components/AddNewExpertise";
import ExpertiseTable from "@/app/(dashboard)/dashboard/expertise/components/ExpertiseTable";
import { usePermission } from "@/hooks/usePermission";

const Experitse = () => {
  const pathname = usePathname();
  const { modalOpen, openCreateModal, closeModal, mode } = useExpertiseStore();
  const { canCreate } = usePermission();

  return (
      <div>
        <BreadcrumbComponent pathname={pathname} />
        <div>
          <>
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Expertise</h1>
              {canCreate && (
                <Button variant={"outline"} onClick={openCreateModal}>Add New</Button>
              )}
            </div>

            <ExpertiseTable />

            <Dialog open={modalOpen} onOpenChange={(v) => !v && closeModal()}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {mode === "create" ? "Add Profile" : "Edit Profile"}
                  </DialogTitle>
                </DialogHeader>

                <AddNewExpertise />
              </DialogContent>
            </Dialog>
          </>

        </div>
      </div>
  );
};

export default Experitse;
