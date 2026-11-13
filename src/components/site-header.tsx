'use client';

import {useEffect, useRef, useState} from 'react';
import Image from 'next/image';
import {useLocale, useTranslations} from 'next-intl';
import {ArrowUpRight, ChevronDown, Menu, X} from 'lucide-react';
import {Link} from '@/i18n/routing';
import {getPageByKey, pathFor, type Locale, type SitePage} from '@/content/registry';

const groups = [
  {key:'services', label:'services', items:['services','event-planning','event-management','event-production','event-logistics','venue-finding']},
  {key:'destinations', label:'destinations', items:['locations','marrakech','casablanca','rabat','tangier','agadir','fes']},
];

const megaServices = [
  {key:'services', en:'All services', fr:'Tous les services'},
  {key:'event-planning', en:'Event planning', fr:'Planification'},
  {key:'event-production', en:'Event production', fr:'Production'},
  {key:'event-logistics', en:'Guest logistics', fr:'Logistique invités'},
  {key:'venue-finding', en:'Venue sourcing', fr:'Recherche de lieux'},
] as const;

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
  const [servicesOpen, setServicesOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const contact = getPageByKey('contact');
  const proposal = getPageByKey('request-a-proposal');
  const portfolio = getPageByKey('portfolio');
  const about = getPageByKey('about');
  const closeNavigation = () => {
    setMenuOpen(false);
    setServicesOpen(false);
  };

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event:KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeNavigation();
        menuButton.current?.focus();
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  useEffect(() => {
    if (!servicesOpen) return;
    const closeOnOutside = (event: PointerEvent) => {
      if (event.target instanceof Element && !event.target.closest('[data-services-menu]')) setServicesOpen(false);
    };
    window.addEventListener('pointerdown', closeOnOutside);
    return () => window.removeEventListener('pointerdown', closeOnOutside);
  }, [servicesOpen]);

  return (
    <header className="site-header">
      <div className="header-inner container">
        <Link href="/" className="brand" aria-label="79 Events — accueil">
          <span className="brand-logo-window">
            <Image className="brand-logo" src="/images/79events-logo.png" width={438} height={175} alt="" aria-hidden="true" priority />
          </span>
        </Link>

        <nav className="corporate-nav" aria-label="Navigation principale bureau">
          <Link href="/" className="corporate-nav-link" onClick={() => setServicesOpen(false)}>{t('home')}</Link>
          <div className={`nav-services${servicesOpen ? ' is-open' : ''}`} data-services-menu onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)} onFocus={() => setServicesOpen(true)}>
            <button className="corporate-nav-link nav-services-trigger" type="button" aria-expanded={servicesOpen} aria-controls="services-mega-menu" onClick={() => setServicesOpen(true)}>
              {t('services')}<ChevronDown size={15} aria-hidden="true" />
            </button>
            <div id="services-mega-menu" className="mega-menu" role="menu">
              <div className="mega-menu-feature">
                <Image src="/images/preparation-evenement.png" alt="" fill sizes="220px" />
                <span className="mega-menu-feature-shade" aria-hidden="true" />
                <strong>{t('services')}</strong>
                <PageLink page={getPageByKey('services')} locale={locale} onClick={closeNavigation} className="mega-menu-feature-link">{t('services')}<ArrowUpRight size={15} aria-hidden="true" /></PageLink>
              </div>
              <div className="mega-menu-links">
                {megaServices.slice(1).map((item, index) => {
                  const page = getPageByKey(item.key);
                  return page ? <PageLink key={item.key} page={page} locale={locale} onClick={closeNavigation} className="mega-menu-link"><span className="mega-menu-number">0{index + 1}</span><span>{locale === 'fr' ? item.fr : item.en}</span><ArrowUpRight size={15} aria-hidden="true" /></PageLink> : null;
                })}
              </div>
            </div>
          </div>
          <PageLink page={getPageByKey('locations')} locale={locale}>{t('destinations')}</PageLink>
          <PageLink page={about} locale={locale}>{t('about')}</PageLink>
          <PageLink page={contact} locale={locale}>{t('contact')}</PageLink>
        </nav>
        <div className="header-actions">
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
                  return page ? <PageLink key={key} page={page} locale={locale} onClick={closeNavigation} className="site-menu-link"><span>{page.copy[locale].title}</span><ArrowUpRight size={15} aria-hidden="true" /></PageLink> : null;
                })}
              </div>
            </section>
          ))}
          <div className="site-menu-bottom">
            <div className="site-menu-company">
              <Link href="/" onClick={closeNavigation}>{t('home')}<ArrowUpRight size={15} aria-hidden="true" /></Link>
              {[portfolio, about, contact].map((page) => page ? <PageLink key={page.key} page={page} locale={locale} onClick={closeNavigation}>{page.copy[locale].title}<ArrowUpRight size={15} aria-hidden="true" /></PageLink> : null)}
            </div>
            <PageLink page={proposal} locale={locale} onClick={closeNavigation} className="button button-orange" dataTrackEvent="service_cta_clicked">{t('proposal')}<ArrowUpRight size={16} aria-hidden="true" /></PageLink>
          </div>
        </div>
      </nav>
    </header>
  );
}
