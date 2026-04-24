"use client";

import { useEffect, useRef } from "react";
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
import {useExperienceStore} from "@/stores/useExperienceStore";
import {toast} from "sonner";
import {formSchema} from "@/app/(dashboard)/dashboard/experience/schema/formSchema";
import {Experience} from "@/app/(dashboard)/dashboard/experience/interface/Experience";
import {DatePicker} from "@/components/common/DatePicker";

type formSchemaType = z.infer<typeof formSchema>;

const mapExperienceToForm = (exp: Experience): formSchemaType => ({
    title: exp.title ?? "",
    company: exp.company ?? "",
    position: exp.position ?? "",
    start_date: exp.start_date ?? "",
    end_date: exp.end_date ?? "",
    description: exp.description ?? ""
});

const AddNewExperience = () => {

    const {
        mode,
        selectedExperience,
        createExperience,
        updateExperience,
        modalOpen,
        loading,
    } = useExperienceStore();

    const fileRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        title: "",
        company: "",
        position: "",
        start_date: "",
        end_date: "",
        description: ""
    },
  });

    const onSubmit = async (values: formSchemaType) => {
        const fd = new FormData();

        // Laravel requires _method:PUT for file uploads (form method spoofing)
        if (mode === "edit") fd.append("_method", "PUT");

        Object.entries(values).forEach(([k, v]) => {
            if (v !== null && v !== undefined) fd.append(k, v);
        });

        try {
            if (mode === "create") {
                await createExperience(fd);
                toast.success("Experience created");
            } else {
                await updateExperience(selectedExperience!.id, fd);
                toast.success("Experience updated");
            }
        } catch {
            toast.error("Something went wrong");
        }
    };

    useEffect(() => {
        if (mode === "edit" && selectedExperience) {
            form.reset(mapExperienceToForm(selectedExperience));
        }

        if (!modalOpen) {
            form.reset();
            if (fileRef.current) fileRef.current.value = "";
        }
    }, [form, mode, selectedExperience, modalOpen]);

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

            {/* Company */}
            <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                            <Input placeholder="company" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Position */}
            <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Position</FormLabel>
                        <FormControl>
                            <Input placeholder="position" {...field} />
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start date */}
                <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                                <DatePicker
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Select start date"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* End date */}
                <FormField
                    control={form.control}
                    name="end_date"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>End Date</FormLabel>
                            <FormControl>
                                <DatePicker
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Select end date"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

          {/* Submit */}
            <Button type="submit" disabled={loading} className="w-full">
                {mode === "create" ? "Create" : "Update"}
            </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddNewExperience
