'use client';

import { TrailingBlockPlugin  } from 'platejs';
import { useEditorRef } from 'platejs/react';

import { AlignKit } from './plugins/align-kit';
import { BasicBlocksKit } from './plugins/basic-blocks-kit';
import { BasicMarksKit } from './plugins/basic-marks-kit';
import { ColumnKit } from './plugins/column-kit';
import { DndKit } from './plugins/dnd-kit';
import { FixedToolbarKit } from './plugins/fixed-toolbar-kit';
import { FloatingToolbarKit } from './plugins/floating-toolbar-kit';
import { FontKit } from './plugins/font-kit';
import { LineHeightKit } from './plugins/line-height-kit';
import { LinkKit } from './plugins/link-kit';
import { ListKit } from './plugins/list-kit';
import { TableKit } from './plugins/table-kit';
import type {Value} from 'platejs';
import type {TPlateEditor} from 'platejs/react';

export const EditorKit = [
    // Elements
    ...BasicBlocksKit,
    ...TableKit,
    ...ColumnKit,
    ...LinkKit,

    // Marks
    ...BasicMarksKit,
    ...FontKit,

    // Block Style
    ...ListKit,
    ...AlignKit,
    ...LineHeightKit,

    ...DndKit,
    TrailingBlockPlugin,

    // UI
    ...FixedToolbarKit,
    ...FloatingToolbarKit,
];

export type MyEditor = TPlateEditor<Value, (typeof EditorKit)[number]>;

export const useEditor = () => useEditorRef<MyEditor>();
