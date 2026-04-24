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
import {toast} from "sonner";
import {useExpertiseStore} from "@/stores/useExpertiseStore";
import {Expertise} from "@/app/(dashboard)/dashboard/expertise/interface/Expertise";
import errorMessage from "@/lib/errorMessage";

const formSchema = z.object({
    name: z.string(),
    progress: z.string(),
    description: z.string().optional(),
    status: z.boolean().default(true).optional(),
});

type formSchemaType = z.infer<typeof formSchema>;

const mapExpertiseToForm = (expertise: Expertise) => ({
    name : expertise.name ?? "",
    description : expertise.description ?? "",
    status: expertise.status ?? true,
    progress: expertise.progress ? expertise.progress.replace("%", "") : ""
})

const AddNewExpertise = () => {
  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name: "",
        progress: "",
        description: "",
        status: true,
    },
  });

    const {
        mode,
        createExpertise,
        selectedExpertise,
        updateExpertise
    } = useExpertiseStore();

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
              await createExpertise(fd);
              toast.success("Profile is created");
          }else {
              await updateExpertise(selectedExpertise!.id, fd);
              toast.success("Profile is updated");
          }
      }catch (err: unknown){
          const msg = errorMessage(err);
          toast.error("Something went wrong - " + msg);
      }
  };

    useEffect(() => {
        if(mode === 'edit' && selectedExpertise){
            form.reset(mapExpertiseToForm(selectedExpertise));
        }
    }, [mode, selectedExpertise, form]);

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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

            {/* Progress */}
            <FormField
                control={form.control}
                name="progress"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Progress</FormLabel>
                        <FormControl>
                            <Input placeholder="progress" {...field} />
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

export default AddNewExpertise
