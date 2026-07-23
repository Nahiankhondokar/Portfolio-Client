"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import LinkExtension from "@tiptap/extension-link";
import { Image as ImageExtension } from "@tiptap/extension-image";
import { Markdown } from "tiptap-markdown";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TextAlign } from "@tiptap/extension-text-align";
import { Underline as UnderlineExtension } from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { TaskList } from "@tiptap/extension-task-list";
import { TaskItem } from "@tiptap/extension-task-item";
import { FontFamily } from "@tiptap/extension-font-family";
import {
    Bold, Italic, Underline, Strikethrough,
    List, ListOrdered, Heading1, Heading2, Heading3,
    Quote, Code, Link, Image, AlignLeft, AlignCenter,
    AlignRight, AlignJustify, Table as TableIcon, Minus,
    Undo2, Redo2, Highlighter, CheckSquare,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";

const HIGHLIGHT_COLORS = [
    "#fde047", "#86efac", "#93c5fd", "#f9a8d4", "#fdba74", "#c4b5fd", "#d4d4d8",
];

const TEXT_COLORS = [
    "#ffffff", "#d4d4d8", "#a1a1aa", "#71717a",
    "#f87171", "#fb923c", "#facc15", "#4ade80",
    "#60a5fa", "#818cf8", "#c084fc", "#f472b6",
];

interface TextEditorProps {
    value: string;
    onChange: (value: string) => void;
}

export default function TextEditor({ value, onChange }: TextEditorProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const uploadImage = useCallback(async (file: File): Promise<string | null> => {
        const fd = new FormData();
        fd.append("image", file);
        const token = typeof window !== "undefined"
            ? localStorage.getItem("auth_token")
            : null;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}upload`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: fd,
            });
            if (!res.ok) throw new Error("Upload failed");
            const data = await res.json();
            return data.url;
        } catch {
            toast.error("Image upload failed");
            return null;
        }
    }, []);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false,
            }),
            LinkExtension.configure({
                openOnClick: false,
                HTMLAttributes: { class: "text-yellow-500 underline" },
            }),
            ImageExtension.configure({
                allowBase64: false,
            }),
            Table.configure({ resizable: true }),
            TableRow,
            TableCell,
            TableHeader,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            UnderlineExtension,
            TextStyle,
            Color,
            Highlight.configure({ multicolor: true }),
            TaskList,
            TaskItem.configure({ nested: true }),
            FontFamily,
            Markdown.configure({
                html: true,
                tightLists: true,
                bulletListMarker: "-",
            }),
            Placeholder.configure({ placeholder: "Write your story..." }),
        ],
        content: value,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: [
                    "min-h-[400px] max-h-[600px] overflow-y-auto w-full rounded-md",
                    "border border-zinc-800 bg-black p-4 text-zinc-300",
                    "focus:outline-none prose prose-invert max-w-none",
                    "[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:text-white",
                    "[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:text-white",
                    "[&_h3]:text-xl [&_h3]:font-bold [&_h3]:mb-2 [&_h3]:text-white",
                    "[&_p]:mb-4 [&_p]:leading-relaxed",
                    "[&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4",
                    "[&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4",
                    "[&_blockquote]:border-l-4 [&_blockquote]:border-yellow-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-6",
                    "[&_code]:bg-zinc-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-yellow-500 [&_code]:font-mono [&_code]:text-sm",
                    "[&_pre]:bg-zinc-900 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-zinc-800 [&_pre]:my-6 [&_pre]:overflow-x-auto",
                    "[&_pre_code]:text-sm [&_pre_code]:bg-transparent [&_pre_code]:p-0",
                    "[&_hr]:border-t [&_hr]:border-zinc-800 [&_hr]:my-8",
                    "[&_table]:w-full [&_table]:border-collapse [&_table]:mb-4",
                    "[&_th]:border [&_th]:border-zinc-700 [&_th]:p-2 [&_th]:bg-zinc-800 [&_th]:text-white [&_th]:text-left",
                    "[&_td]:border [&_td]:border-zinc-700 [&_td]:p-2",
                    "[&_img]:max-w-full [&_img]:rounded-xl [&_img]:my-4",
                    "[&_mark]:rounded [&_mark]:px-0.5",
                    "[&_ul[data-type=taskList]]:list-none [&_ul[data-type=taskList]]:ml-0",
                    "[&_li[data-type=taskItem]]:flex [&_li[data-type=taskItem]]:items-start [&_li[data-type=taskItem]]:gap-2",
                ].join(" "),
            },
            handlePaste: (_view, event) => {
                const items = event.clipboardData?.items;
                if (!items) return false;
                for (const item of items) {
                    if (item.type.startsWith("image/")) {
                        event.preventDefault();
                        const file = item.getAsFile();
                        if (file) {
                            uploadImage(file).then((url) => {
                                if (url) {
                                    editor?.chain().focus().setImage({ src: url }).run();
                                }
                            });
                        }
                        return true;
                    }
                }
                return false;
            },
            handleDrop: (_view, event) => {
                const files = event.dataTransfer?.files;
                if (!files) return false;
                for (const file of files) {
                    if (file.type.startsWith("image/")) {
                        event.preventDefault();
                        uploadImage(file).then((url) => {
                            if (url) {
                                editor?.chain().focus().setImage({ src: url }).run();
                            }
                        });
                        return true;
                    }
                }
                return false;
            },
        },
        onUpdate: ({ editor: ed }) => {
            onChange(ed.getHTML());
        },
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value);
        }
    }, [value, editor]);

    if (!editor) return null;

    const insertTable = () => {
        editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run();
    };

    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = await uploadImage(file);
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const setLink = () => {
        const previousUrl = editor.getAttributes("link").href;
        const url = window.prompt("Enter URL", previousUrl);
        if (url === null) return;
        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
        } else {
            editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
        }
    };

    const Separator = () => (
        <div className="w-px h-5 bg-zinc-700 mx-1 self-center" />
    );

    return (
        <div className="space-y-2">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-0.5 p-1.5 bg-zinc-900 border border-zinc-800 rounded-lg">
                {/* Headings */}
                <Toggle size="sm" pressed={editor.isActive("heading", { level: 1 })} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
                    <Heading1 className="h-3.5 w-3.5" />
                </Toggle>
                <Toggle size="sm" pressed={editor.isActive("heading", { level: 2 })} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
                    <Heading2 className="h-3.5 w-3.5" />
                </Toggle>
                <Toggle size="sm" pressed={editor.isActive("heading", { level: 3 })} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
                    <Heading3 className="h-3.5 w-3.5" />
                </Toggle>

                <Separator />

                {/* Inline formatting */}
                <Toggle size="sm" pressed={editor.isActive("bold")} onPressedChange={() => editor.chain().focus().toggleBold().run()}>
                    <Bold className="h-3.5 w-3.5" />
                </Toggle>
                <Toggle size="sm" pressed={editor.isActive("italic")} onPressedChange={() => editor.chain().focus().toggleItalic().run()}>
                    <Italic className="h-3.5 w-3.5" />
                </Toggle>
                <Toggle size="sm" pressed={editor.isActive("underline")} onPressedChange={() => editor.chain().focus().toggleUnderline().run()}>
                    <Underline className="h-3.5 w-3.5" />
                </Toggle>
                <Toggle size="sm" pressed={editor.isActive("strike")} onPressedChange={() => editor.chain().focus().toggleStrike().run()}>
                    <Strikethrough className="h-3.5 w-3.5" />
                </Toggle>
                <Toggle size="sm" pressed={editor.isActive("highlight")} onPressedChange={() => editor.chain().focus().toggleHighlight().run()}>
                    <Highlighter className="h-3.5 w-3.5" />
                </Toggle>

                <Separator />

                {/* Text color */}
                <div className="flex gap-0.5">
                    {TEXT_COLORS.map((c) => (
                        <button
                            key={c}
                            type="button"
                            onClick={() => editor.chain().focus().setColor(c).run()}
                            className="w-5 h-5 rounded border border-zinc-700 hover:scale-110 transition-transform self-center"
                            style={{ backgroundColor: c }}
                            title={c}
                        />
                    ))}
                </div>

                <Separator />

                {/* Highlight colors */}
                <div className="flex gap-0.5">
                    {HIGHLIGHT_COLORS.map((c) => (
                        <button
                            key={c}
                            type="button"
                            onClick={() => editor.chain().focus().toggleHighlight({ color: c }).run()}
                            className="w-5 h-5 rounded border border-zinc-700 hover:scale-110 transition-transform self-center"
                            style={{ backgroundColor: c }}
                            title={c}
                        />
                    ))}
                </div>

                <Separator />

                {/* Alignment */}
                <Toggle size="sm" pressed={editor.isActive({ textAlign: "left" })} onPressedChange={() => editor.chain().focus().setTextAlign("left").run()}>
                    <AlignLeft className="h-3.5 w-3.5" />
                </Toggle>
                <Toggle size="sm" pressed={editor.isActive({ textAlign: "center" })} onPressedChange={() => editor.chain().focus().setTextAlign("center").run()}>
                    <AlignCenter className="h-3.5 w-3.5" />
                </Toggle>
                <Toggle size="sm" pressed={editor.isActive({ textAlign: "right" })} onPressedChange={() => editor.chain().focus().setTextAlign("right").run()}>
                    <AlignRight className="h-3.5 w-3.5" />
                </Toggle>
                <Toggle size="sm" pressed={editor.isActive({ textAlign: "justify" })} onPressedChange={() => editor.chain().focus().setTextAlign("justify").run()}>
                    <AlignJustify className="h-3.5 w-3.5" />
                </Toggle>

                <Separator />

                {/* Lists */}
                <Toggle size="sm" pressed={editor.isActive("bulletList")} onPressedChange={() => editor.chain().focus().toggleBulletList().run()}>
                    <List className="h-3.5 w-3.5" />
                </Toggle>
                <Toggle size="sm" pressed={editor.isActive("orderedList")} onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}>
                    <ListOrdered className="h-3.5 w-3.5" />
                </Toggle>
                <Toggle size="sm" pressed={editor.isActive("taskList")} onPressedChange={() => editor.chain().focus().toggleTaskList().run()}>
                    <CheckSquare className="h-3.5 w-3.5" />
                </Toggle>

                <Separator />

                {/* Blocks */}
                <Toggle size="sm" pressed={editor.isActive("blockquote")} onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}>
                    <Quote className="h-3.5 w-3.5" />
                </Toggle>
                <Toggle size="sm" pressed={editor.isActive("codeBlock")} onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}>
                    <Code className="h-3.5 w-3.5" />
                </Toggle>
                <Toggle size="sm" onPressedChange={() => editor.chain().focus().setHorizontalRule().run()}>
                    <Minus className="h-3.5 w-3.5" />
                </Toggle>

                <Separator />

                {/* Insert */}
                <Toggle size="sm" onPressedChange={() => fileInputRef.current?.click()}>
                    <Image className="h-3.5 w-3.5" />
                </Toggle>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                />
                <Toggle size="sm" onPressedChange={insertTable}>
                    <TableIcon className="h-3.5 w-3.5" />
                </Toggle>
                <Toggle size="sm" pressed={editor.isActive("link")} onPressedChange={setLink}>
                    <Link className="h-3.5 w-3.5" />
                </Toggle>

                <Separator />

                {/* Undo / Redo */}
                <Toggle size="sm" onPressedChange={() => editor.chain().focus().undo().run()}>
                    <Undo2 className="h-3.5 w-3.5" />
                </Toggle>
                <Toggle size="sm" onPressedChange={() => editor.chain().focus().redo().run()}>
                    <Redo2 className="h-3.5 w-3.5" />
                </Toggle>
            </div>

            <EditorContent editor={editor} />
        </div>
    );
}
