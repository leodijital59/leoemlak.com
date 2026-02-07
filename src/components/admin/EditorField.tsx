"use client";

import {
    Plate,
    usePlateEditor,
} from 'platejs/react';
import type { Value } from 'platejs';

import { Editor, EditorContainer } from '@/components/ui/editor';
import {EditorKit} from "@/components/editor/editor-kit.tsx";

export interface EditorFieldProps {
    /**
     * The current Plate Value. Should be an array of Plate nodes.
     */
    value?: Value;

    /**
     * Called when the editor value changes.
     */
    onChange?: (value: string) => void;

    /**
     * Placeholder text to display when editor is empty.
     */
    placeholder?: string;
}

export function EditorField({
    value,
    onChange,
    placeholder = "Type here...",
    ...props
}: EditorFieldProps) {
    const editor = usePlateEditor({
        plugins: EditorKit,
        /*[
            BoldPlugin,
            ItalicPlugin,
            UnderlinePlugin,
            H1Plugin.withComponent(H1Element),
            H2Plugin.withComponent(H2Element),
            H3Plugin.withComponent(H3Element),
            BlockquotePlugin.withComponent(BlockquoteElement),
        ],*/
        value: value ?? [{ type: "p", children: [{ text: "" }] }],
    });

    return (
        <Plate
            editor={editor}
            onChange={({ value }) => {
                onChange?.(JSON.stringify(value, null, 0));
            }}
            {...props}
        >
            <EditorContainer>
                <Editor placeholder={placeholder} className="max-h-80" />
            </EditorContainer>
        </Plate>
    );
}
