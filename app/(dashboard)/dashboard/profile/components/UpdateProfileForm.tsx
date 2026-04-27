import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { toFormData } from "@/lib/toFormData";
import { z } from "zod";
import { useProfileStore } from "@/stores/useProfileStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@radix-ui/react-separator";
import { Profile } from "@/app/(dashboard)/dashboard/profile/interface/Profile";
import errorMessage from "@/lib/errorMessage";

/* ===============================
   ZOD SCHEMAS
================================ */
const schema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    username: z.string().optional(),
    bio: z.string().optional(),
    location: z.string().optional(),
    website: z.string().url().optional(),
    phone: z.string().optional(),
    socials: z.array(z.string()).nullable().optional(),
    image: z
        .instanceof(File)
        .optional()
        .nullable(),
});


type ProfileFormValues = z.infer<typeof schema>

/*------ Profile data mapping ------ */
const mapProfileToForm = (profile: Profile) => ({
    name: profile.name ?? "",
    email: profile.email ?? "",
    username: profile.username ?? "",
    bio: profile.bio ?? "",
    location: profile.location ?? "",
    website: profile.website ?? "",
    phone: profile.phone ?? "",
    socials: profile.socials ?? [],
    image: null,
})


const UpdateProfileForm = () => {

    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const {
        profile,
        fetchProfile,
        updateProfile
    } = useProfileStore();

    /* ---------- PROFILE FORM ---------- */

    const profileForm = useForm<ProfileFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            email: "",
            username: "",
            bio: "",
            location: "",
            website: "",
            phone: "",
            socials: [],
            image: null,
        },
    })

    const handleProfileSubmit = async (values: ProfileFormValues) => {
        const fd = toFormData(values, { arrayFormat: "brackets", booleanFormat: "1/0" });

        // // Laravel requires _method:PUT for file uploads (form method spoofing)
        // fd.append("_method", "PUT");

        try {
            await updateProfile(fd);
            toast.success("Profile updated successfully");

            // Clear the file input from the form state so it doesn't re-upload on next save
            profileForm.setValue("image", null);
        } catch (e: unknown) {
            const msg = errorMessage(e);
            toast.error(msg);
        }
    };

    /* ---------- IMAGE CHANGE ---------- */
    const handleImageChange = (file: File | null) => {
        if (!file) return

        setImagePreview(URL.createObjectURL(file))
        profileForm.setValue("image", file)
    }

    /*------ FETCH PROFILE ----- */
    useEffect(() => {
        if (profile) {
            profileForm.reset(mapProfileToForm(profile));
            // Also set the image preview to the existing avatar URL if available
            if (profile.image) {
                setImagePreview(profile.image);
            }
        }
    }, [profile, profileForm.reset]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Update Profile</CardTitle>
                    <CardDescription>
                        Update your personal information
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Form {...profileForm}>
                        <form
                            onSubmit={profileForm.handleSubmit(handleProfileSubmit)}
                            className="space-y-6"
                        >
                            {/* Avatar */}
                            <div className="flex items-center gap-6">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src={imagePreview ?? ""} />
                                    <AvatarFallback>JD</AvatarFallback>
                                </Avatar>

                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        handleImageChange(e.target.files?.[0] ?? null)
                                    }
                                />
                            </div>

                            <Separator />

                            {/* Name */}
                            <FormField
                                control={profileForm.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* User name */}
                            <FormField
                                control={profileForm.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nick Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your username" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Phone */}
                            <FormField
                                control={profileForm.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your phone" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Email */}
                            <FormField
                                control={profileForm.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Bio */}
                            <FormField
                                control={profileForm.control}
                                name="bio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bio</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your bio" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Website */}
                            <FormField
                                control={profileForm.control}
                                name="website"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Website</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your website" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Location */}
                            <FormField
                                control={profileForm.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Location</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your location" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full">
                                Update Profile
                            </Button>
                        </form>
                    </Form>

                </CardContent>
            </Card>
        </>
    );
}

export default UpdateProfileForm;