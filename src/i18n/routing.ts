import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['fr', 'en', 'es'],
  defaultLocale: 'fr',
  localePrefix: 'as-needed',
  localeDetection: false,
  alternateLinks: false,
});

export const {Link, redirect, usePathname, useRouter, getPathname} = createNavigation(routing);
