import { z } from "zod";

export const teamLoginSchema = z.object({
    name: z.string().min(1, "Name is required"),
    password: z.string().min(1, "Password is required"),
});

export const teamRegisterSchema = z.object({
    name: z.string().min(1, "Name is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const teamMemberSchema = z.object({
    name: z.string().min(1, "Name is required"),
    amount: z.coerce.number().min(0, "Amount must be a positive number"),
    payment_date: z.string().min(1, "Date is required"),
    paid: z.boolean().optional(),
    jersey_number: z.string().optional(),
    note: z.string().optional(),
});

export type TeamLoginInput = z.infer<typeof teamLoginSchema>;
export type TeamRegisterInput = z.infer<typeof teamRegisterSchema>;
export type TeamMemberInput = z.infer<typeof teamMemberSchema>;
