'use client';

import {
  BoldPlugin,
  ItalicPlugin,
  KbdPlugin,
  UnderlinePlugin,
} from '@platejs/basic-nodes/react';

import { KbdLeaf } from '@/components/ui/kbd-node';

export const BasicMarksKit = [
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  KbdPlugin.withComponent(KbdLeaf),
];
