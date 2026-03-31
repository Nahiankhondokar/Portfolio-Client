"use client";

import { motion } from "framer-motion";
import { MailIcon, MapPin, Send } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Contact } from "@/app/(main-portfolio)/type/type";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const formSchema = z.object({
    name: z.string().min(1, "Write your name"),
    email: z.string().min(1, "Write your email").email("Invalid email address"),
    subject: z.string().min(1, "Write your subject"),
    message: z.string().min(1, "Write your message"),
});

type formSchemaType = z.infer<typeof formSchema>;

const ContactSection = ({ data }: { data: Contact }) => {
    const form = useForm<formSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            subject: "",
            message: "",
        },
    });

    const onSubmit = async (values: formSchemaType) => {
        try {
            const url = "v1/public/contact/submit";
            const baseUrl = process.env.NEXT_PUBLIC_API_URL; // Double check name in .env.local

            const res = await fetch(`${baseUrl}${url}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            // Check if the response status is 200-299
            if (!res.ok) {
                throw new Error("Failed to send message");
            }

            const data = await res.json();
            console.log("✅ Server Response:", data);

            toast.success("Message sent successfully!");
            form.reset();

        } catch (error) {
            // console.error("Submission Error:", error);
            toast.error("Something went wrong. Please try again later.");
        }
    };
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="py-20"
        >
            <h2 className="text-center text-4xl lg:text-5xl font-black uppercase mb-16">
                Get In <span className="text-yellow-500">Touch</span>
            </h2>

            <div className="grid lg:grid-cols-3 gap-10">
                {/* Info Column */}
                <div className="lg:col-span-1 space-y-8">
                    <h3 className="text-2xl font-bold uppercase tracking-tight">Do not be shy!</h3>
                    <p className="text-gray-400 leading-relaxed">
                        Feel free to get in touch with me. I am always open to discussing
                        new projects, creative ideas, or opportunities to be part of your visions.
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-[#252525] p-3 rounded-full text-yellow-500">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <p className="uppercase opacity-60 text-[10px] tracking-widest font-bold">Address</p>
                                <p className="text-white font-medium">{ data.address || "Dhaka, Bangladesh"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="bg-[#252525] p-3 rounded-full text-yellow-500">
                                <MailIcon size={24} />
                            </div>
                            <div>
                                <p className="uppercase opacity-60 text-[10px] tracking-widest font-bold">Mail Me</p>
                                <p className="text-white font-medium">{data.email || "info.nahian13@gmail.com"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Column */}
                <div className="lg:col-span-2">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                placeholder="YOUR NAME"
                                                {...field}
                                                className="bg-[#252525] border-none rounded-full px-6 py-6 focus-visible:ring-2 focus-visible:ring-yellow-500 text-white placeholder:text-gray-500 uppercase text-xs font-bold"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500 text-xs ml-4" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                placeholder="YOUR EMAIL"
                                                {...field}
                                                className="bg-[#252525] border-none rounded-full px-6 py-6 focus-visible:ring-2 focus-visible:ring-yellow-500 text-white placeholder:text-gray-500 uppercase text-xs font-bold"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500 text-xs ml-4" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="subject"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormControl>
                                            <Input
                                                placeholder="YOUR SUBJECT"
                                                {...field}
                                                className="bg-[#252525] border-none rounded-full px-6 py-6 focus-visible:ring-2 focus-visible:ring-yellow-500 text-white placeholder:text-gray-500 uppercase text-xs font-bold"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500 text-xs ml-4" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormControl>
                                            <Textarea
                                                placeholder="YOUR MESSAGE"
                                                rows={6}
                                                {...field}
                                                className="bg-[#252525] border-none rounded-[30px] px-6 py-4 focus-visible:ring-2 focus-visible:ring-yellow-500 text-white placeholder:text-gray-500 uppercase text-xs font-bold resize-none"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500 text-xs ml-4" />
                                    </FormItem>
                                )}
                            />

                            <button
                                type="submit"
                                disabled={form.formState.isSubmitting}
                                className="w-fit flex items-center gap-4 border-2 border-yellow-500 rounded-full pl-8 pr-2 py-2 font-bold uppercase tracking-wider hover:bg-yellow-500 hover:text-black transition-all group disabled:opacity-50"
                            >
                                {form.formState.isSubmitting ? "Sending..." : "Send Message"}
                                <span className="bg-yellow-500 text-white p-3 rounded-full group-hover:bg-black transition-colors">
                  <Send size={18} />
                </span>
                            </button>
                        </form>
                    </Form>
                </div>
            </div>
        </motion.section>
    );
};

export default ContactSection;