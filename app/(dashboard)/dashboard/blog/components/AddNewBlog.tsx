"use client";

import React, { useEffect, useRef } from "react";
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
import { toast } from "sonner";
import { formSchema } from "@/app/(dashboard)/dashboard/blog/schema/formSchema";
import { Blog } from "@/app/(dashboard)/dashboard/blog/interface/Blog";
import { useBlogStore } from "@/stores/useBlogStore";
import ImageUpload from "@/components/common/ImageUpload";
import TextEditor from "@/components/common/TextEditor";

type formSchemaType = z.infer<typeof formSchema>;

const mapBlogToForm = (blog: Blog): formSchemaType => ({
    title: blog.title ?? "",
    subtitle: blog.subtitle ?? "",
    status: blog.status ?? true,
    description: blog.description ?? "",
    image: blog?.image ?? ""
});

const AddNewBlog = () => {

    const {
        mode,
        selectedBlog,
        createBlog,
        updateBlog,
        modalOpen
    } = useBlogStore();

    const fileRef = useRef<HTMLInputElement | null>(null);

    const form = useForm<formSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            subtitle: "",
            status: true,
            description: "",
            image: null,
        },
    });

    const onSubmit = async (values: formSchemaType) => {

        const fd = new FormData();
        Object.entries(values).forEach(([k, v]) => {
            if (v === null || v === undefined) return;

            if (k === "image" && v instanceof File) {
                fd.append("image", v);
            } else if (k === "image" && v as string) {
                fd.append("image", "");
            } else if (typeof v === "boolean") {
                fd.append(k, v ? "1" : "0");
            } else {
                fd.append(k, v as string);
            }
        });

        try {
            if (mode === "create") {
                await createBlog(fd);
                toast.success("Blog created");
            } else {
                await updateBlog(selectedBlog!.id, fd);
                toast.success("Blog updated");
            }
        } catch {
            toast.error("Something went wrong");
        }
    };

    useEffect(() => {
        if (mode === "edit" && selectedBlog) {
            form.reset(mapBlogToForm(selectedBlog));
        }

        if (!modalOpen) {
            form.reset();
            if (fileRef.current) fileRef.current.value = "";
        }
    }, [form, mode, selectedBlog, modalOpen]);

    return (
        /* 1. Use a flex container with a fixed max-height */
        <div className="flex flex-col h-full max-h-[85vh]">
            <Form {...form}>
                <form
                    id="user-form"
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col h-[85vh]" // Ensure form takes full available height
                >
                    {/* 2. SCROLLABLE AREA: This holds all your inputs */}
                    <div className="flex-1 overflow-y-auto px-1 pr-4 space-y-6 custom-scrollbar">
                        {/* Title */}
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter title" {...field} className="bg-zinc-950 border-zinc-800" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Sub Title */}
                        <FormField
                            control={form.control}
                            name="subtitle"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Sub Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter subtitle" {...field} className="bg-zinc-950 border-zinc-800" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Description (Tiptap) */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Blog Content</FormLabel>
                                    <FormControl>
                                        <TextEditor value={field.value} onChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Image Upload */}
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Feature Image</FormLabel>
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
                    </div>

                    {/* 3. FIXED BOTTOM BUTTON: Always visible */}
                    <div className="mt-auto pt-6 border-t border-zinc-800 bg-black/90 backdrop-blur-md">
                        <Button
                            type="submit"
                            disabled={form.formState.isSubmitting}
                            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-widest py-6 rounded-xl shadow-[0_-10px_30px_rgba(0,0,0,0.5)] transition-all active:scale-[0.98]"
                        >
                            {form.formState.isSubmitting ? "Saving..." : mode === "create" ? "Create Post" : "Update Post"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default AddNewBlog
