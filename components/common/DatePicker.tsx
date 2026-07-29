"use client";

import * as React from "react";
import { format, parseISO, isValid } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
    value?: string | null;
    onChange: (date: string | undefined) => void;
    placeholder?: string;
    disabled?: boolean;
    fromYear?: number;
    toYear?: number;
}

export function DatePicker({
    value,
    onChange,
    placeholder = "Pick a date",
    disabled = false,
    fromYear = 1900,
    toYear = new Date().getFullYear(),
}: DatePickerProps) {
    const dateValue = React.useMemo(() => {
        if (!value) return undefined;
        const parsed = parseISO(value);
        return isValid(parsed) ? parsed : undefined;
    }, [value]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    disabled={disabled}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !value && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateValue ? format(dateValue, "PPP") : <span>{placeholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={dateValue}
                    onSelect={(date) => {
                        onChange(date?.toISOString());
                    }}
                    captionLayout="dropdown"
                    fromYear={fromYear}
                    toYear={toYear}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
}