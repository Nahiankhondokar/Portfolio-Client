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
import {useServiceStore} from "@/stores/useServiceStore";
import {useEffect} from "react";
import AddNewService from "./components/AddNewService";
import ServiceTable from "@/app/(dashboard)/dashboard/service/components/ServiceTable";
import { usePermission } from "@/hooks/usePermission";

const Service = () => {
  const pathname = usePathname();
  const { fetchService, loading, error, openCreateModal, modalOpen, closeModal, mode } = useServiceStore();
  const { canCreate } = usePermission();

  useEffect(() => {
    fetchService();
  }, []);

  return (
    <div>
      <BreadcrumbComponent pathname={pathname} />
      <>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Service</h1>
          {canCreate && (
            <Button variant={"outline"} onClick={openCreateModal}>Add New</Button>
          )}
        </div>

        <ServiceTable />

        <Dialog open={modalOpen} onOpenChange={(v) => !v && closeModal()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {mode === "create" ? "Add Portfolio" : "Edit Portfolio"}
              </DialogTitle>
            </DialogHeader>

            <AddNewService />
          </DialogContent>
        </Dialog>
      </>
    </div>
  );
};

export default Service;
