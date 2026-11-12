import Image from 'next/image';
import {ArrowUpRight, Building2, ChevronRight, CircleHelp, Compass, FileText, MapPin} from 'lucide-react';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/routing';
import {getPageByKey, pathFor, type Locale, type SitePage} from '@/content/registry';
import {ProposalForm} from '@/components/proposal-form';

export async function ContentPage({page, locale}: {page: SitePage; locale: Locale}) {
  const t = await getTranslations({locale, namespace:'page'});
  const nav = await getTranslations({locale, namespace:'nav'});
  const copy = page.copy[locale];
  const proposal = getPageByKey('request-a-proposal')!;
  const contact = getPageByKey('contact')!;
  const isFormPage = page.kind === 'contact' || page.kind === 'proposal';
  const heroActionHref = isFormPage ? '#proposal-form' : page.kind === 'legal' ? pathFor(contact, locale) : pathFor(proposal, locale);
  const heroActionLabel = page.kind === 'contact' ? 'Écrire un message' : page.kind === 'legal' ? nav('contact') : nav('proposal');
  const homeHref = '/';
  const parentKey = page.path.split('/')[0];
  const parent = getPageByKey(parentKey);
  const related = page.related.map((key) => getPageByKey(key)).filter((item): item is SitePage => Boolean(item && item.published));
  const steps = t.raw('steps') as {title: string; body: string}[];

  return (
    <main>
      <section className={`content-hero content-hero-${page.kind}`}>
        <div className="container content-hero-inner">
          <nav className="breadcrumbs" aria-label="Fil d’Ariane">
            <Link href={homeHref}>{t('home')}</Link><span aria-hidden="true">/</span>
            {parent && parent.key !== page.key && <><Link href={pathFor(parent, locale)}>{parent.copy[locale].title}</Link><span aria-hidden="true">/</span></>}
            <span aria-current="page">{copy.title}</span>
          </nav>
          <div className="content-hero-grid">
            <div className="content-hero-copy">
              <p className="content-hero-eyebrow eyebrow"><Compass size={15} aria-hidden="true" />{copy.eyebrow}</p>
              <h1>{copy.title}</h1>
              <p className="content-hero-lead">{copy.description}</p>
              <Link className="button button-blue" data-track-event={page.kind === 'venues' ? 'venue_inquiry_started' : 'service_cta_clicked'} href={heroActionHref}>{heroActionLabel}<ArrowUpRight size={16} aria-hidden="true" /></Link>
            </div>
            <div className="content-hero-visual">
              <Image className="content-hero-image" src={page.image} alt={copy.imageAlt} fill priority sizes="(max-width: 720px) 100vw, 48vw" />
              <span className="content-hero-icon" aria-hidden="true"><Building2 size={22} strokeWidth={1.6} /></span>
              {page.kind === 'location' && <span className="location-stamp"><MapPin size={15} aria-hidden="true" />Maroc</span>}
            </div>
          </div>
        </div>
      </section>

      <article className="document-shell container">
        <header className="document-intro">
          <p className="document-kicker"><FileText size={16} aria-hidden="true" />{copy.eyebrow}</p>
          <p className="document-lead">{copy.intro}</p>
        </header>

        <section className="document-section">
          <p className="eyebrow">{t('capabilities')}</p>
          <h2>Ce que nous coordonnons.</h2>
          <div className="document-entries">
            {copy.offerings.map((offer, index) => <div className="document-entry" key={offer.title}><span className="document-entry-index">0{index + 1}</span><div><h3>{offer.title}</h3><p>{offer.body}</p></div><ChevronRight className="document-entry-chevron" size={21} aria-hidden="true" /></div>)}
          </div>
        </section>

        {isFormPage ? (
          <section className="document-section document-form-section" id="proposal-form">
            <div className="document-section-heading"><p className="eyebrow">Quelques repères</p><h2>Votre projet, en quelques détails.</h2><p>{copy.note}</p></div>
            <div className="form-panel"><ProposalForm kind={page.kind === 'contact' ? 'contact' : 'proposal'} /></div>
          </section>
        ) : (
          <>
            <section className="document-section">
              <p className="eyebrow">{t('process')}</p>
              <h2>Les étapes du projet.</h2>
              <div className="document-entries document-steps">
                {steps.map((step, index) => <div className="document-entry" key={step.title}><span className="document-entry-index">0{index + 1}</span><div><h3>{step.title}</h3><p>{step.body}</p></div><ChevronRight className="document-entry-chevron" size={21} aria-hidden="true" /></div>)}
              </div>
            </section>

            <aside className="document-note">
              <p className="eyebrow">{page.kind === 'location' ? t('local') : 'Périmètre du projet'}</p>
              <p>{copy.note}</p>
            </aside>

            <section className="document-section document-questions">
              <p className="eyebrow"><CircleHelp size={16} aria-hidden="true" />{t('faq')}</p>
              <h2>À clarifier avant de commencer.</h2>
              <div className="document-entries">
                {copy.faqs.map((item) => <div className="document-entry" key={item.question}><div><h3>{item.question}</h3><p>{item.answer}</p></div><ChevronRight className="document-entry-chevron" size={21} aria-hidden="true" /></div>)}
              </div>
            </section>
          </>
        )}

        {related.length > 0 && page.kind !== 'legal' && <section className="document-section document-related"><p className="eyebrow">{t('related')}</p><h2>À lire ensuite.</h2><div className="document-related-links">{related.slice(0, page.key === 'locations' ? 6 : 4).map((item) => <Link key={item.key} href={pathFor(item, locale)}>{item.copy[locale].title}<ArrowUpRight size={16} aria-hidden="true" /></Link>)}</div></section>}

        <footer className="document-next-step">
          <p className="eyebrow">Prochaine étape</p>
          <h2>{t('ctaTitle')}</h2>
          <p>{t('ctaText')}</p>
          <Link className="button button-orange" data-track-event={page.kind === 'venues' ? 'venue_inquiry_started' : 'service_cta_clicked'} href={pathFor(proposal, locale)}>{t('ctaButton')}<ArrowUpRight size={16} /></Link>
        </footer>
      </article>
    </main>
  );
}
