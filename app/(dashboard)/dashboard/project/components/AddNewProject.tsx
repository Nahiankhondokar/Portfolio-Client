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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {useProjectStore} from "@/stores/useProjectStore";
import {toast} from "sonner";
import {Project} from "@/app/(dashboard)/dashboard/project/interface/Project";
import ImageUpload from "@/components/common/ImageUpload";

const formSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    project_link: z.string().url().optional(),
    status: z.boolean().default(true).optional(),
    media: z.any().nullable().optional()
});

const mapProjectToForm = (project: Project) => ({
    title : project.title ?? "",
    description : project.description ?? "",
    project_link : project.project_link ?? "",
    status: project.status ?? true,
    media : null
})

type formSchemaType = z.infer<typeof formSchema>;

const AddNewProject = () => {
  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        title: "",
        description: "",
        project_link: "",
        status: true,
        media: null
    },
  });

    const {
        mode,
        createProject,
        selectedProject,
        updateProject
    } = useProjectStore();

  const onSubmit = async (values: formSchemaType) => {
      const fd = new FormData();

      // Laravel requires _method:PUT for file uploads (form method spoofing)
      if (mode === "edit") fd.append("_method", "PUT");

      Object.entries(values).forEach(([k, v]) => {
          if (v === null || v === undefined) return;

          if (typeof v === "boolean") {
              fd.append(k, v ? "1" : "0"); // or "true"/"false" based on backend
          } else {
              fd.append(k, v);
          }
      });

      try {
          if(mode === 'create'){
              await createProject(fd);
              toast.success("Project is created");
          }else {
              await updateProject(selectedProject!.id, fd);
              toast.success("Project is updated");
          }
      }catch (err: unknown){
          toast.error("Something went wrong");
      }
  };

    useEffect(() => {
        if(mode === 'edit' && selectedProject){
            form.reset(mapProjectToForm(selectedProject));
        }
    }, [mode, selectedProject]);

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

            {/* Project link */}
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
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddNewProject;
