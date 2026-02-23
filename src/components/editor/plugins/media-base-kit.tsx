import {
  BaseImagePlugin,
  BaseMediaEmbedPlugin,
  BasePlaceholderPlugin,
  BaseVideoPlugin,
} from '@platejs/media';

import { ImageElementStatic } from '@/components/ui/media-image-node-static';
import { VideoElementStatic } from '@/components/ui/media-video-node-static';

export const BaseMediaKit = [
  BaseImagePlugin.withComponent(ImageElementStatic),
  BaseVideoPlugin.withComponent(VideoElementStatic),
  BaseMediaEmbedPlugin,
  BasePlaceholderPlugin,
];
