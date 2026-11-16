import Image from 'next/image';
import type {UnsplashPhoto as Photo} from '@/content/unsplash';

type Props = {
  photo: Photo;
  alt?: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

export function UnsplashImage({photo, alt, sizes, priority, className}: Props) {
  return <Image src={photo.src} alt={alt ?? photo.alt} fill sizes={sizes} priority={priority} unoptimized className={className} />;
}

export function PhotoCredit({photo}: {photo: Photo}) {
  return <a className="photo-credit" href={photo.photographerUrl} target="_blank" rel="noopener noreferrer">{photo.photographer} / Unsplash</a>;
}
