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
    image: blog?.image ?? "",
    meta_title: blog.meta?.meta_title ?? "",
    meta_description: blog.meta?.meta_description ?? "",
});

type AddNewBlogProps = {
    mode: "create" | "edit";
    blog?: Blog | null;
    onSuccess?: () => void;
};

const AddNewBlog = ({ mode, blog, onSuccess }: AddNewBlogProps) => {

    const { createBlog, updateBlog } = useBlogStore();

    const fileRef = useRef<HTMLInputElement | null>(null);

    const form = useForm<formSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            subtitle: "",
            status: true,
            description: "",
            image: null,
            meta_title: "",
            meta_description: "",
        },
    });

    const onSubmit = async (values: formSchemaType) => {

        const fd = new FormData();

        if (mode === "edit") fd.append("_method", "PUT");

        const metaKeys = ["meta_title", "meta_description"];

        Object.entries(values).forEach(([k, v]) => {
            if (v === null || v === undefined) return;
            if (metaKeys.includes(k)) return;

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

        if (values.meta_title) fd.append("meta[meta_title]", values.meta_title);
        if (values.meta_description) fd.append("meta[meta_description]", values.meta_description);

        try {
            if (mode === "create") {
                await createBlog(fd);
                toast.success("Blog created");
            } else {
                await updateBlog(blog!.id, fd);
                toast.success("Blog updated");
            }
            onSuccess?.();
        } catch {
            toast.error("Something went wrong");
        }
    };

    useEffect(() => {
        if (mode === "edit" && blog) {
            form.reset(mapBlogToForm(blog));
        }
    }, [mode, blog, form]);

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-2xl font-bold">
                    {mode === "create" ? "Add New Blog" : "Edit Blog"}
                </h1>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
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
                        </div>

                        <div className="space-y-6">
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

                            <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">SEO Meta</h3>
                                <FormField
                                    control={form.control}
                                    name="meta_title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Meta Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="SEO title (max 70 chars)" {...field} maxLength={70} className="bg-zinc-950 border-zinc-800 text-xs" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="meta_description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Meta Description</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="SEO description (max 160 chars)" {...field} maxLength={160} rows={3} className="bg-zinc-950 border-zinc-800 text-xs resize-none" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="checkbox"
                                        className="h-4 w-4 accent-yellow-500"
                                        checked={form.watch("status")}
                                        onChange={(e) => form.setValue("status", e.target.checked)}
                                        id="blog-status"
                                    />
                                    <FormLabel htmlFor="blog-status" className="text-xs font-bold uppercase tracking-widest text-zinc-400 cursor-pointer">
                                        Published
                                    </FormLabel>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pt-6 border-t border-zinc-800">
                        <Button
                            type="submit"
                            disabled={form.formState.isSubmitting}
                            className="bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-widest px-8 py-6 rounded-xl transition-all active:scale-[0.98]"
                        >
                            {form.formState.isSubmitting ? "Saving..." : mode === "create" ? "Create Post" : "Update Post"}
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => window.history.back()}
                            className="text-zinc-400"
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default AddNewBlog
