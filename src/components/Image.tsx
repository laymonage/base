import { existsSync } from 'fs';
import sizeOf from 'image-size';
import NextImage, { ImageProps } from 'next/legacy/image';

export default function Image({ src, width, height, ...rest }: ImageProps) {
  if (!existsSync(src.toString()) || width || height)
    return <NextImage src={src} width={width} height={height} {...rest} />;

  const dimensions = sizeOf(src as string);
  return (
    <NextImage
      src={src}
      width={dimensions.width}
      height={dimensions.height}
      {...rest}
    />
  );
}
