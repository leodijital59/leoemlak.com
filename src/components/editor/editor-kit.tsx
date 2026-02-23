'use client';

import { TrailingBlockPlugin } from 'platejs';
import { useEditorRef } from 'platejs/react';
import type {Value} from 'platejs';
import type {TPlateEditor} from 'platejs/react';

import { AlignKit } from '@/components/editor/plugins/align-kit';
import { AutoformatKit } from '@/components/editor/plugins/autoformat-kit';
import { BasicBlocksKit } from '@/components/editor/plugins/basic-blocks-kit';
import { BasicMarksKit } from '@/components/editor/plugins/basic-marks-kit';
import { BlockMenuKit } from '@/components/editor/plugins/block-menu-kit';
import { BlockPlaceholderKit } from '@/components/editor/plugins/block-placeholder-kit';
import { ColumnKit } from '@/components/editor/plugins/column-kit';
import { CursorOverlayKit } from '@/components/editor/plugins/cursor-overlay-kit';
import { DndKit } from '@/components/editor/plugins/dnd-kit';
import { FixedToolbarKit } from '@/components/editor/plugins/fixed-toolbar-kit';
import { FloatingToolbarKit } from '@/components/editor/plugins/floating-toolbar-kit';
import { FontKit } from '@/components/editor/plugins/font-kit';
import { LineHeightKit } from '@/components/editor/plugins/line-height-kit';
import { LinkKit } from '@/components/editor/plugins/link-kit';
import { ListKit } from '@/components/editor/plugins/list-kit';
import { MediaKit } from '@/components/editor/plugins/media-kit';
import { TableKit } from '@/components/editor/plugins/table-kit';

export const EditorKit = [
    // Elements
    ...BasicBlocksKit,
    ...TableKit,
    ...MediaKit,
    ...ColumnKit,
    ...LinkKit,

    // Marks
    ...BasicMarksKit,
    ...FontKit,

    // Block Style
    ...ListKit,
    ...AlignKit,
    ...LineHeightKit,

    // Editing
    ...AutoformatKit,
    ...CursorOverlayKit,
    ...BlockMenuKit,
    ...DndKit,
    TrailingBlockPlugin,

    // UI
    ...BlockPlaceholderKit,
    ...FixedToolbarKit,
    ...FloatingToolbarKit,
];

export type MyEditor = TPlateEditor<Value, (typeof EditorKit)[number]>;

export const useEditor = () => useEditorRef<MyEditor>();
