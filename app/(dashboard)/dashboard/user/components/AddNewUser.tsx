"use client";

import React, { useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { User } from "@/app/(dashboard)/dashboard/user/type/user";
import { useUserStore } from "@/stores/useUserStore";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import ImageUpload from "@/components/common/ImageUpload";

// --- 1. Zod Schema ---
// Keep it strict. If the form always has a value (via defaultValues),
// don't mark it .optional() in Zod, as it creates type mismatches.
// --- 1. Updated Zod Schema ---
export const userFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    username: z.string().min(1, "Username is required"),
    phone: z.string().min(1, "Phone is required"),
    status: z.boolean(),
    // Password fields
    password: z.string().optional(),
    password_confirmation: z.string().optional(),
    role: z.number().nullable().optional(),
    bio: z.string().nullable().optional(),
    location: z.string().nullable().optional(),
    website: z.string().nullable().optional(),
    image: z.any().nullable().optional(),
    socials: z.array(z.string()).optional(),
}).refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
});

type formSchemaType = z.infer<typeof userFormSchema>;

// --- 2. Updated Mapping Function ---
const mapUserToForm = (user: User): formSchemaType => ({
    name: user.name ?? "",
    email: user.email ?? "",
    username: user.username ?? "",
    phone: user.phone ?? "",
    status: user.status ?? true,
    socials: user.socials ?? [],
    role: user.role ?? 3,
    bio: user.bio ?? "",
    website: user.website ?? "",
    location: user.location ?? "",
    // Always reset passwords to empty when opening the form
    password: "",
    password_confirmation: "",
    image: user.image ?? null,
});

const AddNewUser = () => {
    const { mode, createUser, selectedUser, updateUser } = useUserStore();

    const form = useForm<formSchemaType>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            name: "",
            email: "",
            username: "",
            phone: "",
            status: true,
            password: "",
            password_confirmation: "",
            role: 3,
            bio: "",
            location: "",
            website: "",
            socials: [],
            image: null,
        },
    });

    const onSubmit = async (values: formSchemaType) => {
        // Validation check for Create mode
        if (mode === "create" && !values.password) {
            form.setError("password", { message: "Password is required for new users" });
            return;
        }

        const fd = new FormData();

        // Laravel requires _method:PUT for file uploads (form method spoofing)
        if (mode === "edit") fd.append("_method", "PUT");

        Object.entries(values).forEach(([k, v]) => {
            if (v === null || v === undefined) return;

            // Skip password fields in Edit mode if they are empty
            if (mode === "edit" && (k === "password" || k === "password_confirmation") && !v) {
                return;
            }

            if (k === "image" && v instanceof File) {
                fd.append("image", v);
            }else if(k === "image" && v as string){
                fd.append("image", "");
            }else if (typeof v === "boolean") {
                fd.append(k, v ? "1" : "0");
            } else {
                fd.append(k, v as string);
            }
        });

        try {
            if (mode === "create") {
                await createUser(fd);
                toast.success("User created successfully");
            } else {
                await updateUser(selectedUser!.id, fd);
                toast.success("User updated successfully");
            }
        } catch (err: unknown) {
            // If API returns validation errors, map them to the form
            toast.error("Validation Error: Please check the fields");
        }
    };

    useEffect(() => {
        if (mode === "edit" && selectedUser) {
            form.reset(mapUserToForm(selectedUser));
        }
    }, [mode, selectedUser, form]);

    return (
        <div className="p-4 border rounded-lg bg-card">
            <Form {...form}>
                <form  onSubmit={form.handleSubmit(
                    onSubmit,
                    (errors) => {
                        console.log("❌ FORM ERRORS:", errors);
                    }
                )}
                      className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="username" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Phone number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Password */}
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password {mode === 'edit' && "(Leave blank to keep current)"}</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="••••••••" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Password Confirmation */}
                    <FormField
                        control={form.control}
                        name="password_confirmation"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="••••••••" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Role Dropdown */}
                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>User Role</FormLabel>
                                <Select
                                    onValueChange={(value) => field.onChange(parseInt(value))}
                                    defaultValue={field.value?.toString()}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="1">Super Admin</SelectItem>
                                        <SelectItem value="2">Admin</SelectItem>
                                        <SelectItem value="3">User</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                    {/* Fix: Use 'field.value ?? ""' to convert null to an empty string
                                      so the HTML textarea component remains happy.
                                    */}
                                    <Textarea
                                        placeholder="Short bio..."
                                        {...field}
                                        value={field.value ?? ""}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/*Image upload*/}
                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base font-semibold text-foreground/80">Profile Image</FormLabel>
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

                    <Button type="submit" variant="outline" className="w-full">
                        {mode === "create" ? "Create User" : "Update User"}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default AddNewUser;