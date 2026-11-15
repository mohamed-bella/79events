'use client';

import {useEffect, useRef, useState} from 'react';
import Image from 'next/image';
import {useLocale, useTranslations} from 'next-intl';
import {Menu, X} from 'lucide-react';
import {Link} from '@/i18n/routing';
import {getPageByKey, pathFor, type Locale} from '@/content/registry';

const mainLinks = ['home', 'about', 'services', 'portfolio', 'contact'] as const;

export function SiteHeader() {
  const locale = useLocale() as Locale;
  const t = useTranslations('nav');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
        menuButton.current?.focus();
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  const links = mainLinks.map((key) => ({key, href:key === 'home' ? '/' : pathFor(getPageByKey(key)!, locale), label:t(key)}));

  return <header className="site-header simple-site-header">
    <div className="header-inner container">
      <Link href="/" className="brand" aria-label="79 Events — accueil" onClick={closeMenu}>
        <span className="brand-logo-window"><Image className="brand-logo" src="/images/79events-logo-terracotta.png" width={1280} height={1152} alt="" aria-hidden="true" priority /></span>
      </Link>
      <nav className="corporate-nav simple-desktop-nav" aria-label={locale === 'fr' ? 'Navigation principale' : 'Main navigation'}>
        {links.map((link) => <Link key={link.key} href={link.href}>{link.label}</Link>)}
      </nav>
      <button ref={menuButton} className="menu-toggle" type="button" aria-label={menuOpen ? t('close') : t('menu')} aria-expanded={menuOpen} aria-controls="site-navigation" onClick={() => setMenuOpen((open) => !open)}>
        <span>{menuOpen ? t('close') : t('menu')}</span>{menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
      </button>
    </div>
    <nav id="site-navigation" className={`site-menu simple-mobile-menu${menuOpen ? ' is-open' : ''}`} aria-label={locale === 'fr' ? 'Navigation mobile' : 'Mobile navigation'} aria-hidden={!menuOpen} inert={!menuOpen}>
      <div className="container simple-mobile-links">{links.map((link) => <Link key={link.key} href={link.href} onClick={closeMenu}>{link.label}</Link>)}</div>
    </nav>
  </header>;
}
