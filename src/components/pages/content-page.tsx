import {ArrowUpRight, Check, CircleHelp, Mail} from 'lucide-react';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/routing';
import {getPageByKey, pathFor, type Locale, type SitePage} from '@/content/registry';
import {photoForPage} from '@/content/site-photos';
import {SiteImage} from '@/components/site-photo';
import {company} from '@/lib/company';

export async function ContentPage({page, locale}: {page: SitePage; locale: Locale}) {
  const t = await getTranslations({locale, namespace:'page'});
  const nav = await getTranslations({locale, namespace:'nav'});
  const copy = page.copy[locale];
  const proposal = getPageByKey('request-a-proposal')!;
  const contact = getPageByKey('contact')!;
  const isForm = page.kind === 'contact' || page.kind === 'proposal';
  const isLegal = page.kind === 'legal';
  const isAbout = page.key === 'about';
  const heroHref = isForm ? '#contact-email' : isLegal ? pathFor(contact, locale) : pathFor(proposal, locale);
  const heroLabel = isForm ? nav('contact') : isLegal ? nav('contact') : nav('proposal');
  const emailSubject = page.kind === 'proposal' ? t('proposalEmailSubject') : t('contactEmailSubject');
  const emailHref = `mailto:${company.email}?subject=${encodeURIComponent(emailSubject)}`;
  const related = page.related.map(getPageByKey).filter((item): item is SitePage => Boolean(item?.published)).slice(0, 3);
  const steps = t.raw('steps') as {title:string; body:string}[];
  const heroPhoto = photoForPage(page.key);
  const featurePhoto = photoForPage(page.key, 1);
  const relatedPhotos = related.map((item) => photoForPage(item.key));
  return <main className="landing-page inner-landing-page">
    <section className="landing-hero inner-landing-hero" aria-labelledby="page-title"><div className="landing-hero-image" aria-hidden="true"><SiteImage photo={heroPhoto} alt="" priority sizes="100vw" /></div><div className="landing-hero-wash" /><div className="container landing-hero-inner"><p className="landing-eyebrow">{copy.eyebrow}</p><h1 id="page-title">{copy.title}</h1><p>{copy.description}</p><Link className="button button-orange" href={heroHref}>{heroLabel}<ArrowUpRight size={17} aria-hidden="true" /></Link></div></section>
    <div className="landing-main container">
      <section className="landing-feature"><div className="landing-feature-copy"><p className="eyebrow">{copy.eyebrow}</p><h2>{t('intro')}</h2><p>{copy.intro}</p></div><div className="landing-feature-photo"><SiteImage photo={featurePhoto} sizes="(max-width: 700px) 100vw, 48vw" /></div></section>
      <section className="landing-feature landing-feature-reverse"><div className="landing-feature-copy"><h2>{t('capabilities')}</h2><div className="landing-points">{copy.offerings.map((offer) => <p key={offer.title}><Check size={18} aria-hidden="true" /><span><strong>{offer.title}</strong><small>{offer.body}</small></span></p>)}</div></div><div className="landing-feature-photo"><SiteImage photo={relatedPhotos[0] ?? heroPhoto} sizes="(max-width: 700px) 100vw, 48vw" /></div></section>
      {isForm ? <section className="landing-email-contact" id="contact-email" data-scroll-reveal><div className="landing-email-copy"><p className="eyebrow">{nav('contact')}</p><h2>{t('formTitle')}</h2><p>{t('formBody')}</p></div><div className="landing-email-action"><a className="button button-dark" href={emailHref}>{t('emailButton')}<ArrowUpRight size={17} aria-hidden="true" /></a><a className="landing-email-address" href={`mailto:${company.email}`}><Mail size={18} aria-hidden="true" />{company.email}</a></div></section> : <>
        <section className="landing-feature"><div className="landing-feature-copy"><h2>{t('process')}</h2><div className="landing-points">{steps.map((step) => <p key={step.title}><Check size={18} aria-hidden="true" /><span><strong>{step.title}</strong><small>{step.body}</small></span></p>)}</div></div><div className="landing-feature-photo"><SiteImage photo={relatedPhotos[1] ?? featurePhoto} sizes="(max-width: 700px) 100vw, 48vw" /></div></section>
        <section className="landing-feature landing-feature-reverse"><div className="landing-feature-copy"><p className="eyebrow"><CircleHelp size={16} aria-hidden="true" />{t('faq')}</p><h2>{t('faq')}</h2><div className="landing-points">{copy.faqs.map((item) => <p key={item.question}><Check size={18} aria-hidden="true" /><span><strong>{item.question}</strong><small>{item.answer}</small></span></p>)}</div></div><div className="landing-feature-photo"><SiteImage photo={relatedPhotos[2] ?? heroPhoto} sizes="(max-width: 700px) 100vw, 48vw" /></div></section>
        {isLegal && <p className="landing-legal-note">{copy.note}</p>}
      </>}
      {related.length > 0 && !isLegal && <section className="landing-related"><h2>{t('related')}</h2><div>{related.map((item) => <Link key={item.key} href={pathFor(item, locale)}>{item.copy[locale].eyebrow}<ArrowUpRight size={17} aria-hidden="true" /></Link>)}</div></section>}
      {isAbout && <section className="company-details" aria-labelledby="company-details-title">
        <p className="eyebrow">{t('companyDetails.eyebrow')}</p>
        <h2 id="company-details-title">{t('companyDetails.title')}</h2>
        <p className="company-details-intro">{t('companyDetails.intro')}</p>
        <dl className="company-details-grid">
          <div><dt>{t('companyDetails.legalName')}</dt><dd>{company.legalName}</dd></div>
          <div><dt>{t('companyDetails.address')}</dt><dd>{company.postalAddress.streetAddress}<br />{company.postalAddress.addressLocality}, {t('country')}</dd></div>
          {company.identifiers.map(({propertyID, value}) => <div key={propertyID}><dt>{propertyID}</dt><dd>{value}</dd></div>)}
          <div><dt>{t('companyDetails.founded')}</dt><dd>{company.foundingDate}</dd></div>
        </dl>
      </section>}
    </div>
    {!isForm && !isLegal && <section className="landing-cta"><div className="container"><h2>{t('ctaTitle')}</h2><Link className="button button-orange" href={pathFor(proposal, locale)}>{t('ctaButton')}<ArrowUpRight size={17} aria-hidden="true" /></Link></div></section>}
  </main>;
}
