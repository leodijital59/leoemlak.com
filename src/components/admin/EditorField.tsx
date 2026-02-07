"use client";

import { useMemo } from 'react';
import {
    Plate,
    usePlateEditor,
} from 'platejs/react';
import type { Value } from 'platejs';

import { Editor, EditorContainer } from '@/components/ui/editor';
import {EditorKit} from "@/components/editor/editor-kit.tsx";

export interface EditorFieldProps {
    /**
     * The current editor value. Can be either a Plate Value (array of nodes) or a JSON string.
     */
    value?: Value | string;

    /**
     * Called when the editor value changes. Returns a JSON stringified value.
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
    // Parse incoming value: string (JSON) → Value, or use Value as-is
    const parsedValue = useMemo(() => {
        if (!value) {
            return [{ type: "p", children: [{ text: "" }] }];
        }

        // If value is a string (JSON), parse it
        if (typeof value === "string") {
            try {
                return JSON.parse(value) as Value;
            } catch {
                // Invalid JSON, return default value
                return [{ type: "p", children: [{ text: "" }] }];
            }
        }

        // Already a Value array, use as-is
        return value;
    }, [value]);

    const editor = usePlateEditor({
        plugins: EditorKit,
        value: parsedValue,
    });

    return (
        <Plate
            editor={editor}
            onChange={({ value: editorValue }) => {
                // Always return JSON string to maintain consistency
                onChange?.(JSON.stringify(editorValue));
            }}
            {...props}
        >
            <EditorContainer>
                <Editor placeholder={placeholder} className="max-h-80" />
            </EditorContainer>
        </Plate>
    );
}
