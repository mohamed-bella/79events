import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, setRequestLocale} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {DM_Sans} from 'next/font/google';
import {ArrowUpRight} from 'lucide-react';
import {routing} from '@/i18n/routing';
import {SiteHeader} from '@/components/site-header';
import {SiteFooter} from '@/components/site-footer';
import {AnalyticsInteractions} from '@/components/analytics-interactions';
import {ScrollAnimations} from '@/components/scroll-animations';
import {Link} from '@/i18n/routing';
import {company, getSiteUrl} from '@/lib/company';
import '../globals.css';
import '../styles.css';

const dmSans = DM_Sans({subsets:['latin'], variable:'--font-dm-sans', display:'swap'});

export const metadata: Metadata = {
  metadataBase:new URL(getSiteUrl()),
  title:{default:`79events — Agence événementielle de prestige au Maroc`, template:`%s | ${company.name}`},
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
      <body className={dmSans.variable}>
        <NextIntlClientProvider messages={messages}>
          <AnalyticsInteractions />
          <ScrollAnimations />
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
