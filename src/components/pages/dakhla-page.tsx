'use client';

import {useEffect, useRef, useState} from 'react';
import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {FooterLegalDetails} from '@/components/footer-legal-details';
import {LanguageSwitcher} from '@/components/language-switcher';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {useGSAP} from '@gsap/react';
import {Award, BriefcaseBusiness, Camera, ChevronLeft, ChevronRight, Clapperboard, Crown, ExternalLink, Globe2, Handshake, Heart, Mail, Menu, Monitor, Pause, Play, Shield, Sparkles, Trophy, X} from 'lucide-react';
import {dakhlaExpertise, dakhlaGallery, dakhlaReach, dakhlaServices, heroImages} from '@/content/dakhla';
import {pexelsImage} from '@/content/pexels';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const icons = {
  award: Award,
  briefcase: BriefcaseBusiness,
  clapper: Clapperboard,
  crown: Crown,
  globe: Globe2,
  handshake: Handshake,
  heart: Heart,
  monitor: Monitor,
  shield: Shield,
  sparkles: Sparkles,
  trophy: Trophy,
};

type IconName = keyof typeof icons;

function GoldIcon({name, size = 29}: {name: IconName; size?: number}) {
  const Icon = icons[name];
  return <Icon size={size} strokeWidth={1.35} aria-hidden="true" />;
}

function Heading({eyebrow, title, accent}: {eyebrow: string; title: string; accent: string}) {
  return (
    <div className="dh-heading dh-reveal">
      <p>{eyebrow}</p>
      <h2>{title} <em>{accent}</em></h2>
      <span aria-hidden="true" />
    </div>
  );
}

export function DakhlaPage() {
  const t = useTranslations('dakhla');
  const pageRef = useRef<HTMLElement>(null);
  const slidesRef = useRef<HTMLDivElement>(null);
  const activeSlide = useRef(0);
  const slideTransition = useRef<gsap.core.Timeline | null>(null);
  const [slide, setSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const services = t.raw('services') as {title: string; lead: string; detail: string}[];
  const expertise = t.raw('expertise') as {title: string; text: string}[];
  const gallery = t.raw('galleryItems') as {caption: string}[];
  const reach = t.raw('reach') as {title: string; text: string}[];
  const aboutParagraphs = t.raw('about.paragraphs') as string[];

  useEffect(() => {
    const loaderTimer = window.setTimeout(() => setIsLoading(false), 850);
    return () => window.clearTimeout(loaderTimer);
  }, []);

  useEffect(() => {
    const updateHeader = () => setHeaderScrolled(window.scrollY > 18);
    updateHeader();
    window.addEventListener('scroll', updateHeader, {passive: true});
    return () => window.removeEventListener('scroll', updateHeader);
  }, []);

  useEffect(() => {
    if (isPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setTimeout(() => setSlide((current) => (current + 1) % heroImages.length), 6000);
    return () => window.clearTimeout(timer);
  }, [slide, isPaused]);

  useGSAP(() => {
    const root = pageRef.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.fromTo(root.querySelectorAll('.dh-hero-content > *'),
      {autoAlpha: 0, y: 24},
      {autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power2.out', delay: 0.15},
    );
    root.querySelectorAll('.dh-reveal').forEach((element) => {
      gsap.fromTo(element,
        {autoAlpha: 0, y: 14},
        {autoAlpha: 1, y: 0, duration: 0.48, ease: 'power2.out', scrollTrigger: {trigger: element, start: 'top 88%', once: true}},
      );
    });
  }, {scope: pageRef});

  useEffect(() => {
    const slides = slidesRef.current?.querySelectorAll<HTMLElement>('.dh-hero-slide');
    if (!slides || activeSlide.current === slide) return;
    const previous = slides[activeSlide.current];
    const next = slides[slide];
    slideTransition.current?.kill();
    gsap.killTweensOf([previous, next]);
    gsap.set(slides, {zIndex: 0});
    gsap.set(previous, {autoAlpha: 1, zIndex: 1});
    gsap.set(next, {autoAlpha: 0, scale: 1.05, zIndex: 2});

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(previous, {autoAlpha: 0, zIndex: 0});
      gsap.set(next, {autoAlpha: 1, scale: 1, zIndex: 1});
    } else {
      slideTransition.current = gsap.timeline({onComplete: () => {
        gsap.set(previous, {autoAlpha: 0, scale: 1, zIndex: 0});
        gsap.set(next, {zIndex: 1});
      }})
        .to(next, {autoAlpha: 1, scale: 1, duration: 1.2, ease: 'power2.out'}, 0)
        .to(previous, {autoAlpha: 0, duration: 1.2, ease: 'power2.inOut'}, 0);
    }
    activeSlide.current = slide;
  }, [slide]);

  useEffect(() => () => {
    slideTransition.current?.kill();
    if (slidesRef.current) gsap.killTweensOf(slidesRef.current.querySelectorAll('.dh-hero-slide'));
  }, []);

  useEffect(() => {
    if (!menuOpen && selected === null) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        setSelected(null);
      }
    };
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, [menuOpen, selected]);

  return (
    <main ref={pageRef} className="dakhla-home" aria-busy={isLoading}>
      <div className={`dh-loader${isLoading ? ' is-visible' : ' is-hidden'}`} role="status" aria-label={t('loader')} aria-hidden={!isLoading}>
        <div className="dh-loader-content">
          <Image src="/images/logo.png" alt="79events" width={220} height={210} priority className="dh-loader-logo" />
          <span className="dh-loader-kicker">{t('loaderKicker')}</span>
          <span className="dh-loader-progress" aria-hidden="true"><span /></span>
        </div>
      </div>
      <header className={`dh-header${headerScrolled ? ' is-scrolled' : ''}`}>
        <a className="dh-brand" href="#hero" aria-label="79events - accueil">
          <Image src="/images/logo.png" alt="79events" width={72} height={68} priority className="dh-logo" />
        </a>
        <nav className={menuOpen ? 'dh-nav is-open' : 'dh-nav'} aria-label={t('navigation.label')}>
          {[['home', '#hero'], ['services', '#services'], ['gallery', '#gallery'], ['about', '#about'], ['contact', '#contact']].map(([key, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{t(`navigation.${key}`)}</a>)}
        </nav>
        <div className="dh-header-actions">
          <LanguageSwitcher className="dakhla-language-switcher" />
          <button className="dh-menu" type="button" aria-label={menuOpen ? t('navigation.close') : t('navigation.open')} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      <section className="dh-hero" id="hero">
        <div ref={slidesRef} className="dh-hero-media" aria-hidden="true">
          {heroImages.map((name, index) => <div className={`dh-hero-slide${index === slide ? ' is-active' : ''}`} key={name}>
            <Image src={pexelsImage(name)} alt="" fill priority={index === 0} sizes="100vw" />
          </div>)}
        </div>
        <div className="dh-hero-shade" />
        <div className="dh-hero-content">
          <p>{t('hero.eyebrow')}</p>
          <h1>{t('hero.title')} <em>{t('hero.accent')}</em></h1>
          <span className="dh-wide-rule" aria-hidden="true" />
          <p className="dh-hero-lead">{t('hero.lead')}</p>
        </div>
        <div className="dh-slider-controls">
          <button className="dh-slider-arrow" type="button" onClick={() => setSlide((current) => (current - 1 + heroImages.length) % heroImages.length)} aria-label={t('hero.previous')}><ChevronLeft size={18} /></button>
          <div className="dh-dots" aria-label={t('hero.chooseImage')}>
            {heroImages.map((name, index) => <button key={name} className={index === slide ? 'is-active' : ''} type="button" onClick={() => setSlide(index)} aria-label={t('hero.showImage', {number: index + 1})} aria-current={index === slide ? 'true' : undefined} />)}
          </div>
          <button className="dh-slider-arrow" type="button" onClick={() => setSlide((current) => (current + 1) % heroImages.length)} aria-label={t('hero.next')}><ChevronRight size={18} /></button>
          <button className="dh-slider-play" type="button" onClick={() => setIsPaused((paused) => !paused)} aria-label={isPaused ? t('hero.resume') : t('hero.pause')} aria-pressed={isPaused}>{isPaused ? <Play size={14} /> : <Pause size={14} />}</button>
        </div>
        <a className="dh-discover" href="#services">{t('hero.discover')}</a>
      </section>

      <section className="dh-services" id="services"><div className="dh-container">
        <Heading eyebrow={t('servicesEyebrow')} title={t('servicesTitle')} accent={t('servicesAccent')} />
        <div className="dh-service-cards">{dakhlaServices.map(({icon}, index) => { const service = services[index]; return <a className="dh-service-card dh-reveal" href={`#service-${index}`} key={service.title}><GoldIcon name={icon as IconName} /><h3>{service.title}</h3><p>{service.lead}</p></a>; })}</div>
        <div className="dh-service-stories">{dakhlaServices.map(({icon, image}, index) => { const service = services[index]; return <article className={`dh-story dh-reveal${index % 2 ? ' is-reversed' : ''}`} id={`service-${index}`} key={image}><div className="dh-story-image"><Image src={pexelsImage(image)} alt={service.title} fill sizes="(max-width: 760px) 100vw, 48vw" /></div><div className="dh-story-copy"><GoldIcon name={icon as IconName} /><h3>{service.title}</h3><span className="dh-short-rule" aria-hidden="true" /><p>{service.lead}</p><p>{service.detail}</p></div></article>; })}</div>
      </div></section>

      <section className="dh-expertise"><div className="dh-container"><Heading eyebrow={t('expertiseEyebrow')} title={t('expertiseTitle')} accent={t('expertiseAccent')} /><div className="dh-expertise-grid">{dakhlaExpertise.map(({icon}, index) => { const item = expertise[index]; return <article className="dh-expertise-card dh-reveal" key={item.title}><span><GoldIcon name={icon as IconName} /></span><h3>{item.title}</h3><p>{item.text}</p></article>; })}</div></div></section>

      <section className="dh-gallery-section" id="gallery"><div className="dh-container"><Heading eyebrow={t('galleryEyebrow')} title={t('galleryTitle')} accent={t('galleryAccent')} /><p className="dh-intro dh-reveal">{t('galleryIntro')}</p><div className="dh-gallery">{dakhlaGallery.map(({image}, index) => <button className="dh-gallery-item dh-reveal" key={image} type="button" onClick={() => setSelected(index)} aria-label={t('gallery.view', {caption: gallery[index].caption})}><Image src={pexelsImage(image)} alt={gallery[index].caption} fill sizes="(max-width: 700px) 50vw, 33vw" /></button>)}</div></div></section>

      <section className="dh-about" id="about"><div className="dh-container"><Heading eyebrow={t('aboutEyebrow')} title={t('aboutTitle')} accent={t('aboutAccent')} /><div className="dh-about-grid"><div className="dh-about-copy dh-reveal"><span className="dh-short-rule" aria-hidden="true" />{aboutParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><div className="dh-about-image dh-reveal"><Image src={pexelsImage('gala-event')} alt={t('about.imageAlt')} fill sizes="(max-width: 760px) 100vw, 48vw" /></div></div><div className="dh-stats dh-reveal"><div><strong>150+</strong><span>{t('about.stats.events')}</span></div><div><strong>12</strong><span>{t('about.stats.years')}</span></div><div><strong>100%</strong><span>{t('about.stats.custom')}</span></div></div></div></section>

      <section className="dh-reach"><div className="dh-container"><Heading eyebrow={t('reachEyebrow')} title={t('reachTitle')} accent={t('reachAccent')} /><p className="dh-intro dh-reveal">{t('reachIntro')}</p><div className="dh-reach-grid">{dakhlaReach.map(({icon}, index) => { const item = reach[index]; return <article className="dh-reveal" key={item.title}><GoldIcon name={icon as IconName} /><h3>{item.title}</h3><p>{item.text}</p></article>; })}</div></div></section>

      <section className="dh-instagram"><div className="dh-container"><Camera size={29} strokeWidth={1.3} aria-hidden="true" /><Heading eyebrow="@79events" title={t('instagramTitle')} accent={t('instagramAccent')} /><div className="dh-instagram-grid">{dakhlaGallery.map(({image}, index) => <a href="https://www.instagram.com/79events/" target="_blank" rel="noopener noreferrer" aria-label={t('gallery.viewOnInstagram', {caption: gallery[index].caption})} key={image}><Image src={pexelsImage(image)} alt="" fill sizes="(max-width: 680px) 32vw, 16vw" /></a>)}</div><a href="https://www.instagram.com/79events/" target="_blank" rel="noopener noreferrer">{t('instagramLink')}</a></div></section>

      <section className="dh-contact" id="contact"><div className="dh-container"><Heading eyebrow={t('contactEyebrow')} title={t('contactTitle')} accent={t('contactAccent')} /><div className="dh-contact-grid"><div className="dh-email-panel dh-reveal"><Mail size={32} aria-hidden="true" /><p className="dh-email-kicker">{t('contactKicker')}</p><h3>{t('contactHeading')}</h3><p>{t('contactBody')}</p><a className="dh-email-link" href={`mailto:contact@79events.com?subject=${encodeURIComponent(t('contactSubject'))}`}>contact@79events.com <ExternalLink size={15} aria-hidden="true" /></a></div><div className="dh-contact-details dh-reveal"><a href="mailto:contact@79events.com"><Mail size={21} /><span><small>{t('contactEmail')}</small>contact@79events.com</span></a><div><span><small>{t('contactAddress')}</small>Ouarzazate, {t('country')}</span></div></div></div></div></section>

      <footer className="dh-footer"><a className="dh-brand" href="#hero" aria-label="79events"><Image src="/images/logo.png" alt="79events" width={90} height={85} className="dh-footer-logo" /></a><span className="dh-short-rule" aria-hidden="true" /><a className="dh-footer-email" href="mailto:contact@79events.com"><Mail size={15} aria-hidden="true" />contact@79events.com</a><div className="dh-social-links"><a href="https://www.instagram.com/79events/" aria-label="Instagram"><Camera size={16} aria-hidden="true" />Instagram</a><a href="https://www.facebook.com/79events"><ExternalLink size={14} aria-hidden="true" />Facebook</a><a href="https://www.youtube.com/@79events"><ExternalLink size={14} aria-hidden="true" />YouTube</a><a href="https://www.tiktok.com/@79events"><ExternalLink size={14} aria-hidden="true" />TikTok</a></div><FooterLegalDetails /><p>© {new Date().getFullYear()} 79events. {t('rights')}</p></footer>
      {selected !== null && <div className="dh-lightbox" role="dialog" aria-modal="true" aria-label={gallery[selected].caption} onClick={() => setSelected(null)}><button type="button" aria-label={t('lightbox.close')} onClick={() => setSelected(null)}><X size={24} /></button><Image src={pexelsImage(dakhlaGallery[selected].image)} alt={gallery[selected].caption} fill sizes="90vw" /></div>}
    </main>
  );
}
