import {ArrowUpRight, Check, CircleHelp} from 'lucide-react';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/routing';
import {getPageByKey, pathFor, type Locale, type SitePage} from '@/content/registry';
import {ProposalForm} from '@/components/proposal-form';
import {photoForPage} from '@/content/unsplash';
import {PhotoCredit, UnsplashImage} from '@/components/unsplash-photo';

export async function ContentPage({page, locale}: {page: SitePage; locale: Locale}) {
  const t = await getTranslations({locale, namespace:'page'});
  const nav = await getTranslations({locale, namespace:'nav'});
  const copy = page.copy[locale];
  const proposal = getPageByKey('request-a-proposal')!;
  const contact = getPageByKey('contact')!;
  const isForm = page.kind === 'contact' || page.kind === 'proposal';
  const isLegal = page.kind === 'legal';
  const heroHref = isForm ? '#proposal-form' : isLegal ? pathFor(contact, locale) : pathFor(proposal, locale);
  const heroLabel = isForm ? nav('contact') : isLegal ? nav('contact') : nav('proposal');
  const related = page.related.map(getPageByKey).filter((item): item is SitePage => Boolean(item?.published)).slice(0, 3);
  const steps = t.raw('steps') as {title:string; body:string}[];
  const heroPhoto = photoForPage(page.key);
  const featurePhoto = photoForPage(page.key, 1);
  const relatedPhotos = related.map((item) => photoForPage(item.key));
  return <main className="landing-page inner-landing-page">
    <section className="landing-hero inner-landing-hero" aria-labelledby="page-title"><div className="landing-hero-image" aria-hidden="true"><UnsplashImage photo={heroPhoto} alt="" priority sizes="100vw" /></div><div className="landing-hero-wash" /><div className="container landing-hero-inner"><p className="landing-eyebrow">{copy.eyebrow}</p><h1 id="page-title">{copy.title}</h1><p>{copy.description}</p><Link className="button button-orange" href={heroHref}>{heroLabel}<ArrowUpRight size={17} aria-hidden="true" /></Link></div><PhotoCredit photo={heroPhoto} /></section>
    <div className="landing-main container">
      <section className="landing-feature"><div className="landing-feature-copy"><p className="eyebrow">{copy.eyebrow}</p><h2>{t('intro')}</h2><p>{copy.intro}</p></div><div className="landing-feature-photo"><UnsplashImage photo={featurePhoto} sizes="(max-width: 700px) 100vw, 48vw" /><PhotoCredit photo={featurePhoto} /></div></section>
      <section className="landing-feature landing-feature-reverse"><div className="landing-feature-copy"><p className="eyebrow">{t('capabilities')}</p><h2>{t('capabilities')}</h2><div className="landing-points">{copy.offerings.map((offer) => <p key={offer.title}><Check size={18} aria-hidden="true" /><span><strong>{offer.title}</strong><small>{offer.body}</small></span></p>)}</div></div><div className="landing-feature-photo"><UnsplashImage photo={relatedPhotos[0] ?? heroPhoto} alt={copy.imageAlt} sizes="(max-width: 700px) 100vw, 48vw" /><PhotoCredit photo={relatedPhotos[0] ?? heroPhoto} /></div></section>
      {isForm ? <section className="landing-form" id="proposal-form"><div><p className="eyebrow">{nav('contact')}</p><h2>{locale === 'fr' ? 'Parlons de votre projet.' : 'Tell us about your event.'}</h2></div><div className="form-panel"><ProposalForm kind={page.kind === 'contact' ? 'contact' : 'proposal'} /></div></section> : <>
        <section className="landing-feature"><div className="landing-feature-copy"><p className="eyebrow">{t('process')}</p><h2>{t('process')}</h2><div className="landing-points">{steps.map((step) => <p key={step.title}><Check size={18} aria-hidden="true" /><span><strong>{step.title}</strong><small>{step.body}</small></span></p>)}</div></div><div className="landing-feature-photo"><UnsplashImage photo={relatedPhotos[1] ?? featurePhoto} sizes="(max-width: 700px) 100vw, 48vw" /><PhotoCredit photo={relatedPhotos[1] ?? featurePhoto} /></div></section>
        <section className="landing-feature landing-feature-reverse"><div className="landing-feature-copy"><p className="eyebrow"><CircleHelp size={16} aria-hidden="true" />{t('faq')}</p><h2>{t('faq')}</h2><div className="landing-points">{copy.faqs.map((item) => <p key={item.question}><Check size={18} aria-hidden="true" /><span><strong>{item.question}</strong><small>{item.answer}</small></span></p>)}</div></div><div className="landing-feature-photo"><UnsplashImage photo={relatedPhotos[2] ?? heroPhoto} sizes="(max-width: 700px) 100vw, 48vw" /><PhotoCredit photo={relatedPhotos[2] ?? heroPhoto} /></div></section>
        {isLegal && <p className="landing-legal-note">{copy.note}</p>}
      </>}
      {related.length > 0 && !isLegal && <section className="landing-related"><h2>{t('related')}</h2><div>{related.map((item) => <Link key={item.key} href={pathFor(item, locale)}>{item.copy[locale].eyebrow}<ArrowUpRight size={17} aria-hidden="true" /></Link>)}</div></section>}
    </div>
    {!isForm && !isLegal && <section className="landing-cta"><div className="container"><h2>{t('ctaTitle')}</h2><Link className="button button-orange" href={pathFor(proposal, locale)}>{t('ctaButton')}<ArrowUpRight size={17} aria-hidden="true" /></Link></div></section>}
  </main>;
}
