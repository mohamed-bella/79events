import Image from 'next/image';
import {ArrowRight, BriefcaseBusiness, Compass, Gem, Heart, Lightbulb, Sparkles} from 'lucide-react';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/routing';
import {getPageByKey, pathFor, type Locale} from '@/content/registry';

export async function HomePage({locale}: {locale: Locale}) {
  const t = await getTranslations({locale, namespace:'home'});
  const nav = await getTranslations({locale, namespace:'nav'});
  const pages = {
    proposal:getPageByKey('request-a-proposal')!, services:getPageByKey('services')!, about:getPageByKey('about')!,
    portfolio:getPageByKey('portfolio')!, contact:getPageByKey('contact')!,
  };
  const categories = [
    {key:'corporate-events', icon:BriefcaseBusiness, fr:'Événements d’entreprise', en:'Corporate events'},
    {key:'mice', icon:Sparkles, fr:'Séminaires & incentives', en:'Seminars & incentives'},
    {key:'product-launches', icon:Lightbulb, fr:'Lancements de produits', en:'Product launches'},
    {key:'conferences', icon:Gem, fr:'Conférences', en:'Conferences'},
    {key:'team-building', icon:Heart, fr:'Cohésion d’équipe', en:'Team building'},
    {key:'event-planning', icon:Compass, fr:'Sur mesure', en:'Tailor made'},
  ];
  const featured = [
    {key:'corporate-events', fr:'Événements d’entreprise', en:'Corporate events'},
    {key:'conferences', fr:'Conférences', en:'Conferences'},
    {key:'product-launches', fr:'Lancements de produits', en:'Product launches'},
  ];
  const gallery = [
    {src:getPageByKey('corporate-events')!.image, alt:locale === 'fr' ? 'Rencontre professionnelle' : 'Corporate gathering'},
    {src:getPageByKey('conferences')!.image, alt:locale === 'fr' ? 'Espace de conférence' : 'Conference setting'},
    {src:getPageByKey('product-launches')!.image, alt:locale === 'fr' ? 'Événement de marque' : 'Brand event'},
    {src:getPageByKey('team-building')!.image, alt:locale === 'fr' ? 'Équipe réunie' : 'Team gathering'},
    {src:getPageByKey('mice')!.image, alt:locale === 'fr' ? 'Réunion professionnelle' : 'Business meeting'},
    {src:getPageByKey('events')!.image, alt:locale === 'fr' ? 'Événement professionnel' : 'Business event'},
  ];
  return <main className="editorial-home">
    <section className="editorial-hero" aria-labelledby="home-title">
      <Image src="/images/desert-event-hero.png" alt="" fill priority sizes="100vw" />
      <div className="editorial-hero-overlay" />
      <div className="container editorial-hero-content"><p className="editorial-kicker">79 EVENTS</p><h1 id="home-title">{t('title')}</h1><p>{t('lead')}</p><Link className="button editorial-button" href={pathFor(pages.services, locale)}>{t('secondaryCta')}<ArrowRight size={19} aria-hidden="true" /></Link></div>
    </section>
    <nav className="editorial-categories" aria-label={nav('services')}><div className="container editorial-categories-grid">
      {categories.map(({key, icon:Icon, fr, en}) => {const page = getPageByKey(key)!; return <Link key={key} href={pathFor(page, locale)}><Icon size={29} strokeWidth={1.35} aria-hidden="true" /><span>{locale === 'fr' ? fr : en}</span></Link>;})}
    </div></nav>
    <section className="editorial-featured container" aria-label={locale === 'fr' ? 'Nos formats d’événements' : 'Our event formats'}>{featured.map(({key, fr, en}) => {const page = getPageByKey(key)!; return <Link href={pathFor(page, locale)} className="editorial-featured-card" key={key}><Image src={page.image} alt="" fill sizes="(max-width: 700px) 100vw, 33vw" /><span>{locale === 'fr' ? fr : en}<ArrowRight size={19} aria-hidden="true" /></span></Link>;})}</section>
    <section className="editorial-work" aria-labelledby="work-title"><div className="container editorial-work-grid"><div className="editorial-work-copy"><p className="eyebrow">{locale === 'fr' ? 'Notre univers' : 'Our world'}</p><h2 id="work-title">{locale === 'fr' ? 'Des expériences à imaginer' : 'Experiences to imagine'}</h2><p>{locale === 'fr' ? 'Images d’ambiance : lieux, personnes et instants à créer.' : 'Concept imagery: places, people and moments to create.'}</p><Link className="editorial-outline-link" href={pathFor(pages.portfolio, locale)}>{locale === 'fr' ? 'Voir plus' : 'Explore'}<ArrowRight size={18} aria-hidden="true" /></Link></div><div className="editorial-gallery">{gallery.map((item) => <div className="editorial-gallery-image" key={item.src}><Image src={item.src} alt={item.alt} fill sizes="(max-width: 700px) 50vw, 19vw" /></div>)}</div></div></section>
    <section className="editorial-about"><div className="editorial-about-visual"><Image src={getPageByKey('marrakech')!.image} alt="" fill sizes="(max-width: 800px) 100vw, 45vw" /><div className="editorial-about-badge"><Image src="/images/79events-logo-terracotta.png" alt="79 Events" width={1280} height={1152} /></div></div><div className="editorial-about-copy"><p className="eyebrow">{nav('about')}</p><h2>{locale === 'fr' ? 'Une agence événementielle au cœur du Maroc' : 'An event agency rooted in Morocco'}</h2><p>{locale === 'fr' ? 'Créativité, organisation et savoir-faire local pour chaque projet.' : 'Creative thinking, careful planning and local knowledge for every project.'}</p><Link className="editorial-outline-link" href={pathFor(pages.about, locale)}>{locale === 'fr' ? 'En savoir plus' : 'About us'}<ArrowRight size={18} aria-hidden="true" /></Link></div><div className="editorial-about-words" aria-hidden="true">Créativité<br />Organisation<br />Excellence</div></section>
    <section className="editorial-contact"><div className="container"><div><p className="editorial-kicker">79 EVENTS</p><h2>{locale === 'fr' ? 'Parlons de votre projet' : 'Let’s talk about your event'}</h2><p>{locale === 'fr' ? 'Une idée en tête ? Créons-la ensemble.' : 'Have an idea? Let’s make it happen.'}</p></div><Link className="editorial-outline-link" href={pathFor(pages.contact, locale)}>{nav('contact')}<ArrowRight size={18} aria-hidden="true" /></Link></div></section>
  </main>;
}
