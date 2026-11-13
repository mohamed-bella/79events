import Image from 'next/image';
import {ArrowDown, ArrowUpRight, ChevronRight, FileText, MapPin, ShieldCheck} from 'lucide-react';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/routing';
import {getPageByKey, pathFor, type Locale} from '@/content/registry';

export async function HomePage({locale}: {locale: Locale}) {
  const t = await getTranslations({locale, namespace:'home'});
  const pages = {
    events:getPageByKey('events')!, corporate:getPageByKey('corporate-events')!, mice:getPageByKey('mice')!, services:getPageByKey('services')!,
    planning:getPageByKey('event-planning')!, locations:getPageByKey('locations')!, marrakech:getPageByKey('marrakech')!, casablanca:getPageByKey('casablanca')!,
    rabat:getPageByKey('rabat')!, tangier:getPageByKey('tangier')!, agadir:getPageByKey('agadir')!, fes:getPageByKey('fes')!, proposal:getPageByKey('request-a-proposal')!,
  };
  const trustItems = t.raw('trustItems') as {title: string; body: string}[];
  const projectSteps = t.raw('projectSteps') as string[];
  const cards = [
    {number:'01', label:t('eventsLabel'), title:t('eventExpertiseTitle'), body:t('eventExpertiseBody'), image:'/images/conference-maroc.png', page:pages.events},
    {number:'02', label:t('businessTravelLabel'), title:t('miceExpertiseTitle'), body:t('miceExpertiseBody'), image:'/images/hero-terrasse-maroc.png', page:pages.mice},
    {number:'03', label:t('servicesLabel'), title:t('servicesExpertiseTitle'), body:t('servicesExpertiseBody'), image:'/images/preparation-evenement.png', page:pages.services},
  ];
  const cities = [
    {page:pages.marrakech, label:'Marrakech', image:pages.marrakech.image}, {page:pages.casablanca, label:'Casablanca', image:pages.casablanca.image}, {page:pages.rabat, label:'Rabat', image:pages.rabat.image},
    {page:pages.tangier, label:'Tanger', image:pages.tangier.image}, {page:pages.agadir, label:'Agadir', image:pages.agadir.image}, {page:pages.fes, label:'Fès', image:pages.fes.image},
  ];

  return (
    <main>
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero-shade" />
        <div className="home-hero-content container">
          <p className="eyebrow eyebrow-light"><span className="eyebrow-mark" />{t('eyebrow')}</p>
          <h1 id="home-title">{t('title')}</h1>
        </div>
        <a className="hero-scroll" href="#overview"><span>{t('scroll')}</span><ArrowDown size={16} aria-hidden="true" /></a>
        <span className="hero-index">{t('heroFootnote')}</span>
      </section>

      <section className="service-panels" aria-label="Nos expertises">
        <div className="service-panels-grid container">
          {cards.map((card) => (
            <Link className="service-panel" href={pathFor(card.page, locale)} key={card.number}>
              <span className="service-panel-media" aria-hidden="true"><Image src={card.image} alt="" fill sizes="(max-width: 720px) 100vw, 33vw" /></span>
              <span className="service-panel-shade" aria-hidden="true" />
              <span className="service-panel-top"><span className="service-panel-number">{card.number}</span><span className="service-panel-label">{card.label}</span></span>
              <span className="service-panel-copy"><strong>{card.title}</strong></span>
              <span className="service-panel-link"><span>{t('discover')}</span><ArrowUpRight size={17} aria-hidden="true" /></span>
            </Link>
          ))}
        </div>
      </section>

      <article className="document-shell container home-document-shell" id="overview">
        <header className="document-intro">
          <p className="document-kicker"><FileText size={16} aria-hidden="true" />{t('proofLabel')}</p>
          <h2>{t('proofTitle')}</h2>
        </header>

        <section className="document-section">
          <p className="eyebrow"><MapPin size={15} aria-hidden="true" />{t('destinationsEyebrow')}</p>
          <h2>{t('destinationsTitle')}</h2>
          <div className="visual-destination-grid">
            {cities.map(({page, label, image}, index) => <Link className="visual-destination-card" key={page.key} href={pathFor(page, locale)}>
              <Image src={image} alt="" fill sizes="(max-width: 720px) 50vw, 33vw" />
              <span className="visual-destination-shade" aria-hidden="true" />
              <span className="visual-destination-content"><span className="visual-destination-number">0{index + 1}</span><strong>{label}</strong><ArrowUpRight size={16} aria-hidden="true" /></span>
            </Link>)}
          </div>
        </section>

        <section className="document-section">
          <p className="eyebrow">{t('projectsEyebrow')}</p>
          <h2>{t('projectsTitle')}</h2>
          <div className="document-entries document-steps">
            {projectSteps.map((step, index) => <div className="document-entry" key={step}><span className="document-entry-index">0{index + 1}</span><div><h3>{step}</h3></div><ChevronRight className="document-entry-chevron" size={21} aria-hidden="true" /></div>)}
          </div>
        </section>

        <section className="document-section">
          <p className="eyebrow">{t('trustEyebrow')}</p>
          <h2>{t('trustTitle')}</h2>
          <div className="document-entries">
            {trustItems.map((item, index) => <div className="document-entry" key={item.title}><span className="document-entry-index">0{index + 1}</span><div><h3>{item.title}</h3><p>{item.body}</p></div><ChevronRight className="document-entry-chevron" size={21} aria-hidden="true" /></div>)}
          </div>
        </section>

        <footer className="document-next-step">
          <p className="eyebrow"><ShieldCheck size={16} aria-hidden="true" />{t('ctaEyebrow')}</p>
          <h2>{t('ctaTitle')}</h2>
          <Link className="button button-orange" data-track-event="service_cta_clicked" href={pathFor(pages.proposal, locale)}>{t('ctaButton')}<ArrowUpRight size={17} aria-hidden="true" /></Link>
        </footer>
      </article>
    </main>
  );
}
