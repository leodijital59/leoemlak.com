import { Image as UnpicImage  } from '@unpic/react'
import type {ImageProps} from '@unpic/react';
//import {ImgHTMLAttributes} from 'react'

/*interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  fill?: boolean
  layout?: 'fixed' | 'constrained' | 'fullWidth'
}*/

export default function Image(/*{
  width,
  height,
  priority,
  fill,
  layout,
  src,
  alt,
  className,
  ...props
}*/props: ImageProps) {
  // Determine layout
  /*let unpicLayout: 'fixed' | 'constrained' | 'fullWidth' = 'constrained'

  if (fill) {
    unpicLayout = 'fullWidth'
  } else if (layout) {
    unpicLayout = layout
  } else if (width && height) {
    unpicLayout = 'fixed'
  }*/

  return (
    <UnpicImage
      /*src={src}
      alt={alt}
      width={width}
      height={height}
      layout={unpicLayout}
      priority={priority}
      className={className}*/
      {...props}
    />
  )
}
