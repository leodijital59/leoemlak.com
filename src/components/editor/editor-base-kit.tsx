import { BaseAlignKit } from './plugins/align-base-kit';
import { BaseBasicBlocksKit } from './plugins/basic-blocks-base-kit';
import { BaseBasicMarksKit } from './plugins/basic-marks-base-kit';
import { BaseColumnKit } from './plugins/column-base-kit';
import { BaseFontKit } from './plugins/font-base-kit';
import { BaseLineHeightKit } from './plugins/line-height-base-kit';
import { BaseLinkKit } from './plugins/link-base-kit';
import { BaseListKit } from './plugins/list-base-kit';
import { BaseMediaKit } from './plugins/media-base-kit';
import { BaseTableKit } from './plugins/table-base-kit';

export const BaseEditorKit = [
  ...BaseBasicBlocksKit,
  ...BaseTableKit,
  ...BaseMediaKit,
  ...BaseColumnKit,
  ...BaseLinkKit,
  ...BaseBasicMarksKit,
  ...BaseFontKit,
  ...BaseListKit,
  ...BaseAlignKit,
  ...BaseLineHeightKit,
];
