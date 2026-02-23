'use client';

import { BlockMenuPlugin } from '@platejs/selection/react';

import { BlockSelectionKit } from './block-selection-kit';
import { BlockContextMenu } from '@/components/ui/block-context-menu';

export const BlockMenuKit = [
  ...BlockSelectionKit,
  BlockMenuPlugin.configure({
    render: { aboveEditable: BlockContextMenu },
  }),
];
