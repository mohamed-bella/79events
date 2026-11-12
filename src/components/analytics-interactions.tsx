'use client';

import {useEffect} from 'react';
import {trackEvent, type SiteAnalyticsEvent} from '@/lib/analytics';

const supportedEvents = new Set<SiteAnalyticsEvent>([
  'proposal_form_started','proposal_form_submitted','proposal_form_failed','contact_form_submitted',
  'phone_clicked','email_clicked','consultation_clicked','service_cta_clicked','venue_inquiry_started','language_changed',
]);

export function AnalyticsInteractions() {
  useEffect(() => {
    const onClick = (event:MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const target = event.target.closest<HTMLElement>('[data-track-event]');
      const name = target?.dataset.trackEvent as SiteAnalyticsEvent | undefined;
      if (name && supportedEvents.has(name)) trackEvent(name);
    };
    document.addEventListener('click',onClick);
    return () => document.removeEventListener('click',onClick);
  },[]);

  return null;
}
