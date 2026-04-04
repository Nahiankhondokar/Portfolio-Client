import { z } from "zod";

export const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    institute: z.string().min(1, 'Institute is required'),
    // Change these to accept the Date object from the picker
    start_date: z.string().optional(),
    end_date: z.string().optional(),
    description: z.string().optional(),
    subject: z.string().optional(),
    duration: z.string().optional(),
    year: z.string().optional(),
    media: z.string().optional(),
});
