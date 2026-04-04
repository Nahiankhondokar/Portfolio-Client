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
import { useEducationStore } from "@/stores/useEducationStore";
import { toast } from "sonner";
import { formSchema } from "@/app/(dashboard)/dashboard/education/schema/formSchema";
import { Education } from "@/app/(dashboard)/dashboard/education/interface/Education";
import { DatePicker } from "@/components/common/DatePicker";
import { format } from "date-fns";

type formSchemaType = z.infer<typeof formSchema>;

const mapEducationToForm = (edu: Education): formSchemaType => ({
  title: edu.title ?? "",
  institute: edu.institute ?? "",
  subject: edu.subject ?? "",
  duration: edu.duration ?? "",
  start_date: edu.start_date ?? "",
  end_date: edu.end_date ?? "",
  description: edu.description ?? "",
  year: edu.year ?? "",
  media: edu.media?.url ?? "",
});

const AddNewEducation = () => {

  const {
    mode,
    selectedEducation,
    createEducation,
    updateEducation,
    modalOpen,
    loading,
  } = useEducationStore();

  const fileRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      institute: "",
      subject: "",
      duration: "",
      start_date: "",
      end_date: "",
      description: "",
      year: "",
      media: "",
    },
  });


  const onSubmit = async (values: formSchemaType) => {
    const fd = new FormData();

    Object.entries(values).forEach(([k, v]) => {
      if (v !== null && v !== undefined && v !== "") {

        if (mode === "edit") {
          fd.append("_method", "PUT");
        }

        // Check if it's a date field
        if (k === "start_date" || k === "end_date") {
          const dateValue = v instanceof Date ? v : new Date(v as string);

          // Ensure the date is valid before formatting
          if (!isNaN(dateValue.getTime())) {
            fd.append(k, format(dateValue, "yyyy-MM-dd"));
          }
        } else {
          // Append all other fields normally
          fd.append(k, v as string | Blob);
        }
      }
    });

    try {
      if (mode === "create") {
        await createEducation(fd);
        toast.success("Education created");
      } else {
        await updateEducation(selectedEducation!.id, fd);
        toast.success("Education updated");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (mode === "edit" && selectedEducation) {
      form.reset(mapEducationToForm(selectedEducation));
    }

    if (!modalOpen) {
      form.reset();
      if (fileRef.current) fileRef.current.value = "";
    }
  }, [form, mode, selectedEducation, modalOpen]);

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

          {/* Institute */}
          <FormField
            control={form.control}
            name="institute"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Institute</FormLabel>
                <FormControl>
                  <Input placeholder="institute" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Subject */}
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input placeholder="subject" {...field} />
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

          {/* Duration */}
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="duration" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Year */}
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Completed Year</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="year" {...field} />
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

export default AddNewEducation
