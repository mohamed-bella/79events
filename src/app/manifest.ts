import type {MetadataRoute} from 'next';
import {company} from '@/lib/company';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name:company.name,
    short_name:company.name,
    description:company.description,
    start_url:'/',
    display:'standalone',
    background_color:'#0e0c0b',
    theme_color:'#cc9933',
    icons:[{src:'/icon.png',type:'image/png',sizes:'any'}],
  };
}
