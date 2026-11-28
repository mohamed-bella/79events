'use client';

import {company} from '@/lib/company';
import {useLocale, useTranslations} from 'next-intl';

export function FooterLegalDetails() {
  const locale = useLocale();
  const t = useTranslations('legal');
  const {streetAddress, addressLocality} = company.postalAddress;
  const date = new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : locale === 'es' ? 'es-ES' : 'en-GB', {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(company.foundingDate));

  return (
    <section className="footer-legal-details container" aria-label={t('label')}>
      <span>{company.legalName}</span>
      <span>{t('registeredOffice')}: {streetAddress}, {addressLocality}, {t('country')}</span>
      <span>{t('founded')}: <time dateTime={company.foundingDate}>{date}</time></span>
      {company.identifiers.map(({propertyID, value}) => (
        <span key={propertyID}>{propertyID} {value}</span>
      ))}
    </section>
  );
}
