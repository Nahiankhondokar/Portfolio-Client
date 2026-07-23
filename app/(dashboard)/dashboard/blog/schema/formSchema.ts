import { z } from "zod";

export const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    subtitle: z.string().optional(),
    status: z.boolean().optional(),
    description: z.string(),
    image: z.any().nullable().optional(),
    meta_title: z.string().max(70).optional().or(z.literal("")),
    meta_description: z.string().max(160).optional().or(z.literal("")),
});