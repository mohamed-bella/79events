import Image from 'next/image';
import {ArrowUpRight, Check, MapPin, ShieldCheck} from 'lucide-react';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/routing';
import {getPageByKey, pathFor, type Locale} from '@/content/registry';

export async function HomePage({locale}: {locale: Locale}) {
  const t = await getTranslations({locale, namespace:'home'});
  const pages = {events:getPageByKey('events')!, mice:getPageByKey('mice')!, services:getPageByKey('services')!, locations:getPageByKey('locations')!, about:getPageByKey('about')!, proposal:getPageByKey('request-a-proposal')!};
  const cards = [
    {page:pages.events, title:t('eventExpertiseTitle'), body:t('eventExpertiseBody'), image:'/images/conference-maroc.png'},
    {page:pages.mice, title:t('miceExpertiseTitle'), body:t('miceExpertiseBody'), image:'/images/hero-terrasse-maroc.png'},
    {page:pages.services, title:t('servicesExpertiseTitle'), body:t('servicesExpertiseBody'), image:'/images/preparation-evenement.png'},
  ];
  const steps = t.raw('projectSteps') as string[];
  const trust = t.raw('trustItems') as {title:string; body:string}[];
  return <main className="landing-page">
    <section className="landing-hero home-landing-hero" aria-labelledby="home-title">
      <div className="landing-hero-image" aria-hidden="true"><Image src="/images/hero-terrasse-maroc.png" alt="" fill priority sizes="100vw" /></div>
      <div className="landing-hero-wash" />
      <div className="container landing-hero-inner"><p className="landing-eyebrow">{t('eyebrow')}</p><h1 id="home-title">{t('title')}</h1><p>{t('lead')}</p><Link className="button button-orange" href={pathFor(pages.proposal, locale)}>{t('primaryCta')}<ArrowUpRight size={17} aria-hidden="true" /></Link></div>
      <div className="container landing-hero-facts" aria-label={t('projectsEyebrow')}>{steps.map((step, index) => <span key={step}><b>0{index + 1}</b>{step}</span>)}</div>
    </section>
    <section className="landing-main container" id="overview">
      <div className="landing-section-heading"><p className="eyebrow">{t('expertiseEyebrow')}</p><h2>{t('expertiseTitle')}</h2><p>{t('expertiseBody')}</p></div>
      <div className="landing-service-grid">{cards.map((card) => <Link className="landing-service-card" href={pathFor(card.page, locale)} key={card.page.key}><span className="landing-service-image"><Image src={card.image} alt="" fill sizes="(max-width: 700px) 100vw, 33vw" /></span><span className="landing-service-copy"><strong>{card.title}</strong><span>{card.body}</span><ArrowUpRight size={20} aria-hidden="true" /></span></Link>)}</div>
      <section className="landing-feature"><div className="landing-feature-copy"><p className="eyebrow"><Check size={15} aria-hidden="true" />{t('proofLabel')}</p><h2>{t('proofTitle')}</h2><p>{t('proofBody')}</p><Link className="landing-text-link" href={pathFor(pages.services, locale)}>{t('secondaryCta')}<ArrowUpRight size={17} aria-hidden="true" /></Link></div><div className="landing-feature-photo"><Image src="/images/preparation-evenement.png" alt={locale === 'fr' ? 'Équipe préparant un événement' : 'Team preparing an event'} fill sizes="(max-width: 700px) 100vw, 48vw" /></div></section>
      <section className="landing-feature landing-feature-reverse"><div className="landing-feature-copy"><p className="eyebrow"><MapPin size={15} aria-hidden="true" />{t('destinationsEyebrow')}</p><h2>{t('destinationsTitle')}</h2><p>{t('destinationsBody')}</p><Link className="landing-text-link" href={pathFor(pages.locations, locale)}>{t('allDestinations')}<ArrowUpRight size={17} aria-hidden="true" /></Link></div><div className="landing-feature-photo"><Image src="/images/hero-terrasse-maroc.png" alt={t('imageAlt')} fill sizes="(max-width: 700px) 100vw, 48vw" /></div></section>
      <section className="landing-feature"><div className="landing-feature-copy"><p className="eyebrow"><ShieldCheck size={15} aria-hidden="true" />{t('trustEyebrow')}</p><h2>{t('trustTitle')}</h2><div className="landing-points">{trust.map((item) => <p key={item.title}><Check size={18} aria-hidden="true" /><span><strong>{item.title}</strong><small>{item.body}</small></span></p>)}</div><Link className="landing-text-link" href={pathFor(pages.about, locale)}>{t('discover')}<ArrowUpRight size={17} aria-hidden="true" /></Link></div><div className="landing-feature-photo"><Image src="/images/conference-maroc.png" alt={locale === 'fr' ? 'Conférence professionnelle' : 'Business conference'} fill sizes="(max-width: 700px) 100vw, 48vw" /></div></section>
    </section>
    <section className="landing-cta"><div className="container"><h2>{t('ctaTitle')}</h2><Link className="button button-orange" href={pathFor(pages.proposal, locale)}>{t('ctaButton')}<ArrowUpRight size={17} aria-hidden="true" /></Link></div></section>
  </main>;
}
