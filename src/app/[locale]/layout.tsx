import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, setRequestLocale} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {Cormorant_Garamond, Instrument_Sans, Instrument_Serif, Montserrat, Rubik} from 'next/font/google';
import {ArrowUpRight} from 'lucide-react';
import {routing} from '@/i18n/routing';
import {SiteHeader} from '@/components/site-header';
import {SiteFooter} from '@/components/site-footer';
import {AnalyticsInteractions} from '@/components/analytics-interactions';
import {Link} from '@/i18n/routing';
import {company, getSiteUrl} from '@/lib/company';
import '../globals.css';
import '../dakhla.css';

const rubik = Rubik({subsets:['latin'], variable:'--font-rubik', display:'swap'});
const instrumentSans = Instrument_Sans({weight:['400','500','600','700'], subsets:['latin'], variable:'--font-instrument-sans', display:'swap'});
const instrumentSerif = Instrument_Serif({weight:'400', subsets:['latin'], variable:'--font-instrument-serif', display:'swap'});
const cormorant = Cormorant_Garamond({subsets:['latin'], variable:'--font-dakhla-serif', display:'swap'});
const montserrat = Montserrat({subsets:['latin'], variable:'--font-dakhla-sans', display:'swap'});

export const metadata: Metadata = {
  metadataBase:new URL(getSiteUrl()),
  title:{default:`Agence événementielle de prestige à Dakhla | ${company.name}`, template:`%s | ${company.name}`},
  description:company.description,
  applicationName:company.name,
  category:'Agence événementielle',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({children, params}: Readonly<{children:React.ReactNode; params:Promise<{locale:string}>}>) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  return (
      <html lang={locale} data-scroll-behavior="smooth">
      <body className={`${rubik.variable} ${instrumentSans.variable} ${instrumentSerif.variable} ${cormorant.variable} ${montserrat.variable}`}>
        <NextIntlClientProvider messages={messages}>
          <AnalyticsInteractions />
          <a className="skip-link" href="#main-content">Passer au contenu</a>
          <SiteHeader />
          {children}
          <SiteFooter locale={locale as 'en' | 'fr'} />
          <Link className="floating-contact" href="/contact" aria-label="Nous contacter"><span aria-hidden="true"><ArrowUpRight size={18} /></span><span>Contact</span></Link>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
