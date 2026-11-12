'use client';

import {useEffect, useRef, useState} from 'react';
import Image from 'next/image';
import {useLocale, useTranslations} from 'next-intl';
import {ArrowUpRight, Menu, X} from 'lucide-react';
import {Link} from '@/i18n/routing';
import {getPageByKey, pathFor, type Locale, type SitePage} from '@/content/registry';

const groups = [
  {key:'events', label:'events', items:['events','corporate-events','conferences','exhibitions','product-launches','team-building']},
  {key:'mice', label:'mice', items:['mice','meetings','incentive-events']},
  {key:'services', label:'services', items:['services','event-planning','event-management','event-production','event-logistics','venue-finding']},
  {key:'destinations', label:'destinations', items:['locations','marrakech','casablanca','rabat','tangier','agadir','fes']},
];

function PageLink({page, locale, children, onClick, className, dataTrackEvent}: {
  page: SitePage | undefined; locale: Locale; children: React.ReactNode; onClick?: () => void; className?: string; dataTrackEvent?:string;
}) {
  if (!page) return null;
  return <Link href={pathFor(page, locale)} onClick={onClick} className={className} data-track-event={dataTrackEvent}>{children}</Link>;
}

export function SiteHeader() {
  const locale = useLocale() as Locale;
  const t = useTranslations('nav');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const contact = getPageByKey('contact');
  const proposal = getPageByKey('request-a-proposal');
  const portfolio = getPageByKey('portfolio');
  const about = getPageByKey('about');
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event:KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="header-inner container">
        <Link href="/" className="brand" aria-label="79 Events — accueil">
          <span className="brand-logo-window">
            <Image className="brand-logo" src="/images/79events-logo.png" width={438} height={175} alt="" aria-hidden="true" priority />
          </span>
        </Link>

        <nav className="corporate-nav" aria-label="Navigation principale bureau">
          {['events', 'mice', 'services', 'locations', 'about'].map((key) => (
            <PageLink key={key} page={getPageByKey(key)} locale={locale}>{t(key === 'locations' ? 'destinations' : key)}</PageLink>
          ))}
        </nav>
        <div className="header-actions">
          <PageLink page={contact} locale={locale} className="header-contact">{t('contact')}</PageLink>
          <PageLink page={proposal} locale={locale} className="button button-blue header-cta" dataTrackEvent="service_cta_clicked">{t('proposal')}<ArrowUpRight size={15} aria-hidden="true" /></PageLink>
          <button ref={menuButton} className="menu-toggle" type="button" aria-label={menuOpen ? t('close') : t('menu')} aria-expanded={menuOpen} aria-controls="site-navigation" onClick={() => setMenuOpen((open) => !open)}>
            <span>{menuOpen ? 'Fermer' : 'Menu'}</span>
            {menuOpen ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <nav id="site-navigation" className={`site-menu${menuOpen ? ' is-open' : ''}`} aria-label="Navigation principale" aria-hidden={!menuOpen} inert={!menuOpen}>
        <div className="site-menu-inner container">
          {groups.map((group) => (
            <section className="site-menu-group" key={group.key}>
              <h2>{t(group.label)}</h2>
              <div className="site-menu-links">
                {group.items.map((key) => {
                  const page = getPageByKey(key);
                  return page ? <PageLink key={key} page={page} locale={locale} onClick={closeMenu} className="site-menu-link"><span>{page.copy[locale].title}</span><ArrowUpRight size={15} aria-hidden="true" /></PageLink> : null;
                })}
              </div>
            </section>
          ))}
          <div className="site-menu-bottom">
            <div className="site-menu-company">
              {[portfolio, about, contact].map((page) => page ? <PageLink key={page.key} page={page} locale={locale} onClick={closeMenu}>{page.copy[locale].title}<ArrowUpRight size={15} aria-hidden="true" /></PageLink> : null)}
            </div>
            <PageLink page={proposal} locale={locale} onClick={closeMenu} className="button button-orange" dataTrackEvent="service_cta_clicked">{t('proposal')}<ArrowUpRight size={16} aria-hidden="true" /></PageLink>
          </div>
        </div>
      </nav>
    </header>
  );
}
