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
import { useEducationStore } from "@/stores/useEducationStore";
import AddNewEducation from "./components/AddNewEducation";
import EducationTable from "./components/EducationTable";
import { usePermission } from "@/hooks/usePermission";

const Education = () => {
  const pathname = usePathname();
  const { modalOpen, openCreateModal, closeModal, mode } = useEducationStore();
  const { canCreate } = usePermission();

  return (
    <div>
      <BreadcrumbComponent pathname={pathname} />
      <div>
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Educations</h1>
            {canCreate && (
              <Button variant={"outline"} onClick={openCreateModal}>Add New</Button>
            )}
          </div>

          <EducationTable />

          <Dialog open={modalOpen} onOpenChange={(v) => !v && closeModal()}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {mode === "create" ? "Add Education" : "Edit Education"}
                </DialogTitle>
              </DialogHeader>

              <AddNewEducation />
            </DialogContent>
          </Dialog>
        </>

      </div>
    </div>
  );
};

export default Education;
