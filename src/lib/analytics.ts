export type SiteAnalyticsEvent =
  | 'proposal_form_started'
  | 'proposal_form_submitted'
  | 'proposal_form_failed'
  | 'contact_form_submitted'
  | 'phone_clicked'
  | 'email_clicked'
  | 'consultation_clicked'
  | 'service_cta_clicked'
  | 'venue_inquiry_started'
  | 'language_changed';

declare global {
  interface Window {dataLayer?: Array<Record<string, unknown>>}
}

// Emits a local event for a future consent-aware analytics adapter. No analytics
// vendor is loaded until the owner adds a consent platform and approved IDs.
export function trackEvent(event: SiteAnalyticsEvent) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('79events:analytics', {detail:{event}}));
}
