'use client';

import {useLocale, useTranslations} from 'next-intl';
import {Link, usePathname} from '@/i18n/routing';
import {getPageByPath, pathFor, type Locale} from '@/content/registry';

const languageOptions: {locale: Locale; label: string}[] = [
  {locale: 'fr', label: 'FR'},
  {locale: 'en', label: 'EN'},
  {locale: 'es', label: 'ES'},
];

export function LanguageSwitcher({className = ''}: {className?: string}) {
  const locale = useLocale() as Locale;
  const pathname = usePathname() || '/';
  const t = useTranslations('nav');
  const page = getPageByPath(pathname, locale);
  const switchPath = (targetLocale: Locale) => page ? pathFor(page, targetLocale) : pathname;

  return (
    <nav className={`language-switcher${className ? ` ${className}` : ''}`} aria-label={t('language')}>
      <span className="language-switcher-label">{t('language')}</span>
      <div className="language-switcher-options">
        {languageOptions.map((option) => (
          <Link
            key={option.locale}
            href={switchPath(option.locale)}
            locale={option.locale}
            className={option.locale === locale ? 'is-active' : undefined}
            aria-current={option.locale === locale ? 'page' : undefined}
            aria-label={t('switchTo', {language: option.locale === 'fr' ? 'Français' : option.locale === 'en' ? 'English' : 'Español'})}
          >
            {option.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
