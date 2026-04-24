"use client";

import React, {useEffect} from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea";
import {useServiceStore} from "@/stores/useServiceStore";
import {toast} from "sonner";
import {formSchema} from "@/app/(dashboard)/dashboard/service/schema/formSchema";
import {Service} from "@/app/(dashboard)/dashboard/service/interface/Service";
import ImageUpload from "@/components/common/ImageUpload";

type formSchemaType = z.infer<typeof formSchema>;

const mapServiceToForm = (service: Service) => ({
    title: service.title ?? "",
    description: service.description ?? "",
    sub_title: service.sub_title ?? "",
    status: service.status ?? false,
    project_link: service.project_link ?? "",
    created_at: service.created_at ?? "",
    media: null,
})

const AddNewPortfolio = () => {
  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        title: "",
        description: "",
        sub_title: "",
        status: false,
        project_link: "",
        media: "",
        created_at: ""
    },
  });

  const {
      mode,
      createService,
      selectedService,
      updateService
  } = useServiceStore();

  const onSubmit = async (values: formSchemaType) => {
      const fd = new FormData();

      // Laravel requires _method:PUT for file uploads (form method spoofing)
      if (mode === "edit") fd.append("_method", "PUT");

      Object.entries(values).forEach(([k, v]) => {
          if (v === null || v === undefined) return;

          if (k === "media" && v instanceof File) {
              fd.append("media", v);
          }else if(k === "media" && v as string){
              fd.append("media", "");
          }else if (typeof v === "boolean") {
              fd.append(k, v ? "1" : "0"); // or "true"/"false" based on backend
          } else {
              fd.append(k, v);
          }
      });

      try {
          if(mode === 'create'){
              await createService(fd);
              toast.success("Portfolio is created");
          }else {
              await updateService(selectedService!.id, fd);
              toast.success("Portfolio is updated");
          }
      }catch (err: unknown){
          toast.error("Something went wrong");
      }
  };

    useEffect(() => {
        if(mode === 'edit' && selectedService){
            form.reset(mapServiceToForm(selectedService));
        }
    }, [mode, selectedService]);


  return (
    <div>
      <Form {...form}>
        <form
          id="user-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >

          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

            {/* Sub Title */}
            <FormField
                control={form.control}
                name="sub_title"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Sub Title</FormLabel>
                        <FormControl>
                            <Input placeholder="sub title" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Project Link */}
            <FormField
                control={form.control}
                name="project_link"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Project Link</FormLabel>
                        <FormControl>
                            <Input placeholder="project link" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


            {/*Image upload*/}
            <FormField
                control={form.control}
                name="media"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-base font-semibold text-foreground/80">Image</FormLabel>
                        <FormControl>
                            <ImageUpload
                                value={field.value}
                                onChange={(file) => field.onChange(file)}
                                onRemove={() => field.onChange(null)}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

          {/* Status */}
          {/* <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value === true} // Convert number to boolean for UI
                    onCheckedChange={(checked) =>
                      field.onChange(checked ? true : false)
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          /> */}

          {/* Submit */}
          <Button type="submit" variant="outline" className="w-full">
              {mode === "create" ? "Create" : "Update"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddNewPortfolio;
