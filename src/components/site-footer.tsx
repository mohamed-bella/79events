import {ArrowUpRight, Building2, Compass, MapPin} from 'lucide-react';
import Image from 'next/image';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/routing';
import {getPageByKey, pathFor, type Locale} from '@/content/registry';
import {company} from '@/lib/company';

export async function SiteFooter({locale}: {locale: Locale}) {
  const t = await getTranslations({locale, namespace:'footer'});
  const nav = await getTranslations({locale, namespace:'nav'});
  const pages = {
    events: getPageByKey('events'), mice: getPageByKey('mice'), services: getPageByKey('services'), locations: getPageByKey('locations'),
    about: getPageByKey('about'), contact: getPageByKey('contact'), proposal: getPageByKey('request-a-proposal'), privacy: getPageByKey('privacy-policy'),
  };
  return (
    <footer className="site-footer">
      <div className="footer-project container">
        <div><p className="eyebrow eyebrow-light">Votre prochain événement</p><h2>Construisons votre projet ensemble.</h2></div>
        <Link className="button button-orange" href={pathFor(pages.proposal!, locale)}>{nav('proposal')}<ArrowUpRight size={17} aria-hidden="true" /></Link>
      </div>
      <div className="footer-main container">
        <div className="footer-brand-col">
          <Link href="/" className="brand brand-inverse" aria-label={`${company.name} — accueil`}>
            <span className="brand-logo-window">
              <Image className="brand-logo" src="/images/79events-logo.png" width={438} height={175} alt="" aria-hidden="true" />
            </span>
          </Link>
          <p className="footer-statement">{t('statement')}</p>
          <span className="footer-location">{t('location')}</span>
        </div>
        <div className="footer-links-col">
          <h2><Compass size={15} aria-hidden="true" />{t('explore')}</h2>
          {['events','mice','services','locations'].map((key) => {
            const page = pages[key as keyof typeof pages];
            return page ? <Link key={key} href={pathFor(page, locale)}>{nav(key === 'locations' ? 'destinations' : key)}</Link> : null;
          })}
        </div>
        <div className="footer-links-col">
          <h2><Building2 size={15} aria-hidden="true" />{t('company')}</h2>
          {['about','contact','proposal'].map((key) => {
            const page = pages[key as keyof typeof pages];
            return page ? <Link key={key} href={pathFor(page, locale)}>{key === 'proposal' ? nav('proposal') : nav(key)}</Link> : null;
          })}
        </div>
        <div className="footer-links-col footer-contact-col">
          <h2><MapPin size={15} aria-hidden="true" />{t('contact')}</h2>
          <p className="footer-contact-note">Un interlocuteur pour préparer et coordonner votre événement au Maroc.</p>
          {company.email && <a data-track-event="email_clicked" href={`mailto:${company.email}`}><span>{t('email')}</span>{company.email}<ArrowUpRight size={14} /></a>}
          {company.phone && <a data-track-event="phone_clicked" href={`tel:${company.phone.replace(/\s+/g, '')}`}><span>{t('phone')}</span>{company.phone}<ArrowUpRight size={14} /></a>}
          {!company.email && !company.phone && <Link href={pathFor(pages.contact!, locale)}>{nav('contact')}<ArrowUpRight size={14} /></Link>}
          {company.socialLinks.linkedin && <a href={company.socialLinks.linkedin} target="_blank" rel="noreferrer"><span>LinkedIn</span><ArrowUpRight size={14} /></a>}
          {company.socialLinks.instagram && <a href={company.socialLinks.instagram} target="_blank" rel="noreferrer"><span>Instagram</span><ArrowUpRight size={14} /></a>}
        </div>
      </div>
      <div className="footer-bottom container">
        <span>© {new Date().getFullYear()} {company.name}. {t('rights')}</span>
        {pages.privacy && <Link href={pathFor(pages.privacy, locale)}>{t('privacy')}</Link>}
      </div>
    </footer>
  );
}
