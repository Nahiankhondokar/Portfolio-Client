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
import {useEffect} from "react";
import AddNewPortfolio from "./components/AddNewPortfolio";
import PortfolioTable from "@/app/(dashboard)/dashboard/portfolio/components/PortfolioTable";
import {usePortfolioStore} from "@/stores/usePortfolioStore";
import { usePermission } from "@/hooks/usePermission";

const Service = () => {
  const pathname = usePathname();
  const { fetchPortfolio, openCreateModal, modalOpen, closeModal, mode } = usePortfolioStore();
  const { canCreate } = usePermission();

  useEffect(() => {
    fetchPortfolio();
  }, [mode, fetchPortfolio]);

  return (
    <div>
      <BreadcrumbComponent pathname={pathname} />
      <>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Portfolio</h1>
          {canCreate && (
            <Button variant={"outline"} onClick={openCreateModal}>Add New</Button>
          )}
        </div>

        {/*Portfolio Table*/}
        <PortfolioTable />

        <Dialog open={modalOpen} onOpenChange={(v) => !v && closeModal()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {mode === "create" ? "Add Portfolio" : "Edit Portfolio"}
              </DialogTitle>
            </DialogHeader>

            <AddNewPortfolio />
          </DialogContent>
        </Dialog>
      </>
    </div>
  );
};

export default Service;
