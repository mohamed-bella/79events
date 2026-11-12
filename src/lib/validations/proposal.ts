import {z} from 'zod';

const eventText = z.string().trim().min(2).max(100).regex(/^[\p{L}\p{N} .&'’-]+$/u);

export const proposalSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  company: z.string().trim().min(2).max(160),
  workEmail: z.string().trim().email().max(254),
  phone: z.string().trim().min(6).max(40).regex(/^[+\d ().-]+$/),
  country: eventText,
  eventType: eventText,
  city: eventText,
  guestCount: z.string().trim().max(10).refine((value) => !value || /^\d+$/.test(value), 'Enter a whole number.'),
  eventStart: z.string().trim().max(10),
  eventEnd: z.string().trim().max(10),
  budget: z.string().trim().max(100),
  services: z.array(eventText).min(1).max(12),
  requirements: z.string().trim().max(4000),
  privacyConsent: z.boolean().refine((value) => value, 'Consent is required.'),
  companyWebsite: z.string().max(0),
}).superRefine((value, context) => {
  const validDate = (date: string) => {
    if (!date) return true;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
    const parsed = new Date(`${date}T00:00:00.000Z`);
    return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0,10) === date;
  };
  if (!validDate(value.eventStart)) context.addIssue({code:'custom', path:['eventStart'], message:'Enter a valid date.'});
  if (!validDate(value.eventEnd)) context.addIssue({code:'custom', path:['eventEnd'], message:'Enter a valid date.'});
  if (value.eventStart && value.eventEnd && value.eventEnd < value.eventStart) {
    context.addIssue({code:'custom', path:['eventEnd'], message:'The end date must be on or after the start date.'});
  }
});

export type ProposalFormValues = z.input<typeof proposalSchema>;
