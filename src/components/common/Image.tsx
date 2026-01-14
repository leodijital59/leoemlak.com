import { Image as UnpicImage  } from '@unpic/react'
import type {ImageProps} from '@unpic/react';

export default function Image(props: ImageProps) {
  return (
    <UnpicImage {...props} />
  )
}
