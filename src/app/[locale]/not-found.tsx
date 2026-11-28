'use client';

import {ArrowUpRight} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';

export default function NotFound() {
  const t = useTranslations('notFound');
  return <main className="not-found-page"><div className="container"><p className="eyebrow">404 · {t('eyebrow')}</p><h1>{t('title')}</h1><p>{t('body')}</p><Link className="button button-blue" href="/">{t('home')}<ArrowUpRight size={16} /></Link></div></main>;
}
