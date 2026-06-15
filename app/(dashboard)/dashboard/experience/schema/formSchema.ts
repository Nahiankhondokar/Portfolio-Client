import {z} from "zod";

export const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    company: z.string().min(1, 'Company is required'),
    position: z.string().optional(),
    start_date: z.string(),
    end_date: z.string(),
    description: z.string().optional(),
});