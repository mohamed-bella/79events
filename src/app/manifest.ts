import type {MetadataRoute} from 'next';
import {company} from '@/lib/company';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name:company.name,
    short_name:company.name,
    description:company.description,
    start_url:'/',
    display:'standalone',
    background_color:'#f5f7fc',
    theme_color:'#174acb',
    icons:[{src:'/icon.svg',type:'image/svg+xml',sizes:'any'}],
  };
}
