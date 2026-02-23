import { Image as UnpicImage  } from '@unpic/react'
import type {ImageProps} from '@unpic/react';
import type {Ref} from "react";

export default function Image({
  ref,
  ...props
}: ImageProps & { ref?: Ref<HTMLImageElement> }) {
  return (
    <UnpicImage ref={ref} {...props} />
  )
}
