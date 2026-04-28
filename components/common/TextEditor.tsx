"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import { Markdown } from "tiptap-markdown";
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Quote, Code, Link as LinkIcon } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { useEffect } from "react";

interface TextEditorProps {
    value: string;
    onChange: (value: string) => void;
}

export default function TextEditor({ value, onChange }: TextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-yellow-500 underline',
                },
            }),
            Markdown.configure({
                html: true,
                tightLists: true,
                bulletListMarker: '-',
            }),
            Placeholder.configure({ placeholder: "Write your story..." }),
        ],
        content: value,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: "min-h-[300px] w-full rounded-md border border-zinc-800 bg-black p-4 text-zinc-300 focus:outline-none \
                prose prose-invert max-w-none \
                [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:text-white \
                [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:text-white \
                [&_p]:mb-4 [&_p]:leading-relaxed \
                [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 \
                [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4 \
                [&_blockquote]:border-l-4 [&_blockquote]:border-yellow-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-6 \
                [&_code]:bg-zinc-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-yellow-500 [&_code]:font-mono [&_code]:text-sm \
                [&_pre]:bg-zinc-900 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-zinc-800 [&_pre]:my-6 \
                [&_hr]:border-t [&_hr]:border-zinc-800 [&_hr]:my-8",
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value);
        }
    }, [value, editor]);

    if (!editor) return null;

    return (
        <div className="space-y-2">
            {/* Professional Toolbar */}
            <div className="flex flex-wrap gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-lg">
                <Toggle
                    size="sm"
                    pressed={editor.isActive("heading", { level: 1 })}
                    onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                >
                    <Heading1 className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive("heading", { level: 2 })}
                    onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                >
                    <Heading2 className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive("bold")}
                    onPressedChange={() => editor.chain().focus().toggleBold().run()}
                >
                    <Bold className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive("italic")}
                    onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                >
                    <Italic className="h-4 w-4" />
                </Toggle>
                <div className="w-px h-4 bg-zinc-800 mx-1 self-center" />
                <Toggle
                    size="sm"
                    pressed={editor.isActive("bulletList")}
                    onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                >
                    <List className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive("orderedList")}
                    onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                >
                    <ListOrdered className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive("blockquote")}
                    onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
                >
                    <Quote className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive("code")}
                    onPressedChange={() => editor.chain().focus().toggleCode().run()}
                >
                    <Code className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive("link")}
                    onPressedChange={() => {
                        const url = window.prompt("Enter URL");
                        if (url) {
                            editor.chain().focus().setLink({ href: url }).run();
                        }
                    }}
                >
                    <LinkIcon className="h-4 w-4" />
                </Toggle>
            </div>

            <EditorContent editor={editor} />
        </div>
    );
}