'use client';

import {useRef, useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useTranslations} from 'next-intl';
import {ArrowUpRight, Check} from 'lucide-react';
import {proposalSchema, type ProposalFormValues} from '@/lib/validations/proposal';
import {trackEvent} from '@/lib/analytics';
import {Link} from '@/i18n/routing';

export function ProposalForm({kind = 'proposal'}: {kind?:'proposal'|'contact'}) {
  const t = useTranslations('form');
  const [result, setResult] = useState<'idle'|'sending'|'success'|'failure'|'unavailable'>('idle');
  const started = useRef(false);
  const {register, handleSubmit, formState:{errors, isSubmitting}} = useForm<ProposalFormValues>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {services: [], privacyConsent: false, companyWebsite:''},
  });

  const submit = async (values: ProposalFormValues) => {
    setResult('sending');
    try {
      const response = await fetch('/api/proposal', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(values)});
      if (response.ok) {
        setResult('success');
        trackEvent(kind === 'contact' ? 'contact_form_submitted' : 'proposal_form_submitted');
        return;
      }
      const payload = await response.json().catch(() => null) as {code?:string}|null;
      setResult(response.status === 503 || payload?.code === 'DELIVERY_UNAVAILABLE' ? 'unavailable' : 'failure');
      trackEvent('proposal_form_failed');
    } catch {
      setResult('failure');
      trackEvent('proposal_form_failed');
    }
  };

  const err = (name: keyof ProposalFormValues) => {
    const message = errors[name]?.message;
    return message ? <span className="field-error" role="alert">{String(message)}</span> : null;
  };

  return (
    <form className="proposal-form" onFocusCapture={() => { if (!started.current) { started.current = true; trackEvent('proposal_form_started'); } }} onSubmit={handleSubmit(submit)} noValidate>
      <div className="form-heading"><p className="eyebrow">{t('eyebrow')}</p><h2>{t('title')}</h2><p>{t('intro')}</p></div>
      {result === 'success' ? (
        <div className="form-result form-result-success" role="status"><span className="form-result-icon"><Check size={21} /></span><p>{t('success')}</p></div>
      ) : (
        <>
          <div className="honeypot-field" aria-hidden="true"><label htmlFor="companyWebsite">Site internet</label><input id="companyWebsite" tabIndex={-1} autoComplete="off" {...register('companyWebsite')} /></div>
          <div className="form-grid">
            <div className="form-field"><label htmlFor="fullName">{t('fullName')} <span>*</span></label><input id="fullName" autoComplete="name" aria-invalid={Boolean(errors.fullName)} {...register('fullName')} />{err('fullName')}</div>
            <div className="form-field"><label htmlFor="company">{t('company')} <span>*</span></label><input id="company" autoComplete="organization" aria-invalid={Boolean(errors.company)} {...register('company')} />{err('company')}</div>
            <div className="form-field"><label htmlFor="workEmail">{t('email')} <span>*</span></label><input id="workEmail" type="email" autoComplete="email" aria-invalid={Boolean(errors.workEmail)} {...register('workEmail')} />{err('workEmail')}</div>
            <div className="form-field"><label htmlFor="phone">{t('phone')} <span>*</span></label><input id="phone" type="tel" autoComplete="tel" aria-invalid={Boolean(errors.phone)} {...register('phone')} />{err('phone')}</div>
            <div className="form-field"><label htmlFor="country">{t('country')} <span>*</span></label><input id="country" autoComplete="country-name" aria-invalid={Boolean(errors.country)} {...register('country')} />{err('country')}</div>
            <div className="form-field"><label htmlFor="eventType">{t('eventType')} <span>*</span></label><select id="eventType" defaultValue="" aria-invalid={Boolean(errors.eventType)} {...register('eventType')}><option value="">{t('choose')}</option>{(t.raw('eventTypes') as string[]).map((item) => <option key={item}>{item}</option>)}</select>{err('eventType')}</div>
            <div className="form-field"><label htmlFor="city">{t('city')} <span>*</span></label><select id="city" defaultValue="" aria-invalid={Boolean(errors.city)} {...register('city')}><option value="">{t('choose')}</option>{(t.raw('cities') as string[]).map((item) => <option key={item}>{item}</option>)}</select>{err('city')}</div>
            <div className="form-field"><label htmlFor="guestCount">{t('guests')}</label><input id="guestCount" type="number" min="1" inputMode="numeric" aria-invalid={Boolean(errors.guestCount)} {...register('guestCount')} />{err('guestCount')}</div>
            <div className="form-field"><label htmlFor="eventStart">{t('startDate')}</label><input id="eventStart" type="date" aria-invalid={Boolean(errors.eventStart)} {...register('eventStart')} />{err('eventStart')}</div>
            <div className="form-field"><label htmlFor="eventEnd">{t('endDate')}</label><input id="eventEnd" type="date" aria-invalid={Boolean(errors.eventEnd)} {...register('eventEnd')} />{err('eventEnd')}</div>
            <div className="form-field"><label htmlFor="budget">{t('budget')}</label><input id="budget" aria-invalid={Boolean(errors.budget)} {...register('budget')} /></div>
            <fieldset className="form-field form-field-full service-choice-field"><legend>{t('services')} <span>*</span></legend><div className="checkbox-grid">{(t.raw('servicesList') as string[]).map((item) => <label className="checkbox-option" key={item}><input type="checkbox" value={item} {...register('services')} /><span>{item}</span></label>)}</div>{err('services')}</fieldset>
            <div className="form-field form-field-full"><label htmlFor="requirements">{t('requirements')}</label><textarea id="requirements" rows={4} aria-invalid={Boolean(errors.requirements)} {...register('requirements')} /><div className="field-hint">Évitez de partager des données personnelles sensibles.</div>{err('requirements')}</div>
          </div>
          <label className="consent-option"><input type="checkbox" aria-invalid={Boolean(errors.privacyConsent)} {...register('privacyConsent')} /><span>{t('consent')} <Link href="/politique-de-confidentialite">{t('privacyLink')}</Link></span></label>
          {err('privacyConsent')}
          {result === 'failure' && <p className="form-result form-result-error" role="alert">{errors.root?.message || t('failure')}</p>}
          {result === 'unavailable' && <p className="form-result form-result-error" role="alert">{t('unavailable')}</p>}
          <div className="form-submit-row"><button className="button button-dark" type="submit" disabled={isSubmitting || result === 'sending'}>{isSubmitting || result === 'sending' ? t('sending') : t('send')}<ArrowUpRight size={16} aria-hidden="true" /></button><p>{t('required')} <span>*</span></p></div>
        </>
      )}
    </form>
  );
}

