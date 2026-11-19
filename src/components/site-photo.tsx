import Image from 'next/image';
import type {SitePhoto as Photo} from '@/content/site-photos';

type Props = {
  photo: Photo;
  alt?: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

export function SiteImage({photo, alt, sizes, priority, className}: Props) {
  return <Image src={photo.src} alt={alt ?? photo.alt} fill sizes={sizes} priority={priority} className={className} />;
}
