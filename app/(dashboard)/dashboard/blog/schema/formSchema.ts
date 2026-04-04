import { z } from "zod";

export const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    subtitle: z.string().optional(),
    status: z.boolean().optional(),
    description: z.string(),
    image: z.any().nullable().optional()
    // image: z
    //     .i
    //     .refine((file) => file.size <= 2 * 1024 * 1024, {
    //         message: "Max file size is 2MB",
    //     })
    //     .nullable()
    //     .optional(),
});