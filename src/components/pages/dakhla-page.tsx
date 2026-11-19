'use client';

import {useEffect, useRef, useState} from 'react';
import Image from 'next/image';
import {FooterLegalDetails} from '@/components/footer-legal-details';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {useGSAP} from '@gsap/react';
import {Award, BriefcaseBusiness, Camera, ChevronLeft, ChevronRight, Clapperboard, Crown, ExternalLink, Globe2, Handshake, Heart, Mail, Menu, Monitor, Pause, Play, Shield, Sparkles, X} from 'lucide-react';
import {dakhlaExpertise, dakhlaGallery, dakhlaImage, homeImage, dakhlaReach, dakhlaServices, heroImages} from '@/content/dakhla';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const icons = {award: Award, briefcase: BriefcaseBusiness, clapper: Clapperboard, crown: Crown, globe: Globe2, handshake: Handshake, heart: Heart, monitor: Monitor, shield: Shield, sparkles: Sparkles};
type IconName = keyof typeof icons;
const navigation = [['Accueil', '#hero'], ['Services', '#services'], ['Galerie', '#gallery'], ['À Propos', '#about'], ['Contact', '#contact']];

function GoldIcon({name, size = 29}: {name: IconName; size?: number}) {
  const Icon = icons[name];
  return <Icon size={size} strokeWidth={1.35} aria-hidden="true" />;
}

function Heading({eyebrow, title, accent}: {eyebrow: string; title: string; accent: string}) {
  return <div className="dh-heading dh-reveal"><p>{eyebrow}</p><h2>{title} <em>{accent}</em></h2><span aria-hidden="true" /></div>;
}

export function DakhlaPage() {
  const pageRef = useRef<HTMLElement>(null);
  const slidesRef = useRef<HTMLDivElement>(null);
  const activeSlide = useRef(0);
  const slideTransition = useRef<gsap.core.Timeline | null>(null);
  const [slide, setSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

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
    if (slidesRef.current) {
      gsap.killTweensOf(slidesRef.current.querySelectorAll('.dh-hero-slide'));
    }
  }, []);

  useEffect(() => {
    if (!menuOpen && selected === null) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {setMenuOpen(false); setSelected(null);}
    };
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, [menuOpen, selected]);

  return <main ref={pageRef} className="dakhla-home">
    <header className={`dh-header${headerScrolled ? ' is-scrolled' : ''}`}>
      <a className="dh-brand" href="#hero" aria-label="79events — accueil">
        <Image src="/images/logo.png" alt="79events" width={72} height={68} priority className="dh-logo" />
      </a>
      <nav className={menuOpen ? 'dh-nav is-open' : 'dh-nav'} aria-label="Navigation principale">{navigation.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}</nav>
      <button className="dh-menu" type="button" aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
    </header>

    <section className="dh-hero" id="hero">
      <div ref={slidesRef} className="dh-hero-media" aria-hidden="true">{heroImages.map((name, index) => <div className={`dh-hero-slide${index === slide ? ' is-active' : ''}`} key={name}><Image src={homeImage(name)} alt="" fill priority={index === 0} sizes="100vw" /></div>)}</div>
      <div className="dh-hero-shade" />
      <div className="dh-hero-content"><p>Agence Événementielle de Prestige</p><h1>L&apos;Art de l&apos;<em>Exclusivité</em></h1><span className="dh-wide-rule" aria-hidden="true" /><p className="dh-hero-lead">Des expériences sur-mesure au cœur du Sahara et de l&apos;Atlantique.<br />Mariages, galas, lancements — chaque détail est une signature.</p></div>
      <div className="dh-slider-controls">
        <button className="dh-slider-arrow" type="button" onClick={() => setSlide((current) => (current - 1 + heroImages.length) % heroImages.length)} aria-label="Image précédente"><ChevronLeft size={18} /></button>
        <div className="dh-dots" aria-label="Choisir une image">{heroImages.map((name, index) => <button key={name} className={index === slide ? 'is-active' : ''} type="button" onClick={() => setSlide(index)} aria-label={`Afficher l’image ${index + 1}`} aria-current={index === slide ? 'true' : undefined} />)}</div>
        <button className="dh-slider-arrow" type="button" onClick={() => setSlide((current) => (current + 1) % heroImages.length)} aria-label="Image suivante"><ChevronRight size={18} /></button>
        <button className="dh-slider-play" type="button" onClick={() => setIsPaused((paused) => !paused)} aria-label={isPaused ? 'Reprendre le diaporama' : 'Mettre le diaporama en pause'} aria-pressed={isPaused}>{isPaused ? <Play size={14} /> : <Pause size={14} />}</button>
      </div>
      <a className="dh-discover" href="#services">Découvrir</a>
    </section>

    <section className="dh-services" id="services"><div className="dh-container">
      <Heading eyebrow="Nos Expertises" title="Des Services d’" accent="Excellence" />
      <div className="dh-service-cards">{dakhlaServices.map(({title, icon, lead}, index) => <a className="dh-service-card dh-reveal" href={`#service-${index}`} key={title}><GoldIcon name={icon} /><h3>{title}</h3><p>{lead}</p></a>)}</div>
      <div className="dh-service-stories">{dakhlaServices.map(({title, icon, image, lead, detail}, index) => <article className={`dh-story dh-reveal${index % 2 ? ' is-reversed' : ''}`} id={`service-${index}`} key={title}><div className="dh-story-image"><Image src={homeImage(image)} alt={title} fill sizes="(max-width: 760px) 100vw, 48vw" /></div><div className="dh-story-copy"><GoldIcon name={icon} /><h3>{title}</h3><span className="dh-short-rule" aria-hidden="true" /><p>{lead}</p><p>{detail}</p></div></article>)}</div>
    </div></section>

    <section className="dh-expertise"><div className="dh-container"><Heading eyebrow="Savoir-Faire" title="Notre" accent="Expertise" /><div className="dh-expertise-grid">{dakhlaExpertise.map(({title, icon, text}) => <article className="dh-expertise-card dh-reveal" key={title}><span><GoldIcon name={icon} /></span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

    <section className="dh-gallery-section" id="gallery"><div className="dh-container"><Heading eyebrow="Portfolio" title="Nos" accent="Réalisations" /><p className="dh-intro dh-reveal">Chaque événement est une création unique. Découvrez quelques-unes de nos réalisations les plus marquantes, du Sahara à l’Atlantique.</p><div className="dh-gallery">{dakhlaGallery.map(({image, caption}, index) => <button className="dh-gallery-item dh-reveal" key={image} type="button" onClick={() => setSelected(index)} aria-label={`Voir ${caption}`}><Image src={dakhlaImage(image)} alt={caption} fill sizes="(max-width: 700px) 50vw, 33vw" /><span>{caption}</span></button>)}</div></div></section>

    <section className="dh-about" id="about"><div className="dh-container"><Heading eyebrow="Notre Histoire" title="L’Excellence a une" accent="Adresse" /><div className="dh-about-grid"><div className="dh-about-copy dh-reveal"><span className="dh-short-rule" aria-hidden="true" /><p>Depuis plus d’une décennie, 79events transforme chaque projet en scène d’expériences inoubliables au Maroc. Notre connaissance intime du territoire, combinée à un réseau de partenaires internationaux, nous permet de créer des événements à la hauteur des plus grandes exigences.</p><p>Chaque projet est une collaboration étroite avec nos clients — marques de luxe, familles royales, entreprises du Fortune 500 — pour concevoir des moments qui transcendent l’ordinaire.</p><p>Notre équipe pluridisciplinaire — designers, scénographes, directeurs artistiques et coordinateurs terrain — travaille en synergie pour orchestrer chaque détail. Du concept initial à la réalisation finale, nous garantissons une exécution irréprochable et une expérience qui dépasse toutes les attentes.</p></div><div className="dh-about-image dh-reveal"><Image src={dakhlaImage('hero-event')} alt="L’équipe 79events en action lors d’un événement de prestige" fill sizes="(max-width: 760px) 100vw, 48vw" /></div></div><div className="dh-stats dh-reveal"><div><strong>150+</strong><span>Événements</span></div><div><strong>12</strong><span>Années d’Excellence</span></div><div><strong>100%</strong><span>Sur-Mesure</span></div></div></div></section>

    <section className="dh-reach"><div className="dh-container"><Heading eyebrow="Global Reach" title="International Standards —" accent="Local Mastery" /><p className="dh-intro dh-reveal">Nous combinons les standards de qualité internationaux avec une maîtrise inégalée du territoire marocain, offrant à nos clients le meilleur des deux mondes.</p><div className="dh-reach-grid">{dakhlaReach.map(({title, icon, text}) => <article className="dh-reveal" key={title}><GoldIcon name={icon} /><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

    <section className="dh-instagram"><div className="dh-container"><Camera size={29} strokeWidth={1.3} aria-hidden="true" /><Heading eyebrow="@79events" title="Suivez nos" accent="Coulisses" /><div className="dh-instagram-grid">{dakhlaGallery.map(({image, caption}) => <a href="https://www.instagram.com/79events/" target="_blank" rel="noopener noreferrer" aria-label={`Voir ${caption} sur Instagram`} key={image}><Image src={dakhlaImage(image)} alt="" fill sizes="(max-width: 680px) 32vw, 16vw" /></a>)}</div><a href="https://www.instagram.com/79events/" target="_blank" rel="noopener noreferrer">Voir sur Instagram</a></div></section>

    <section className="dh-contact" id="contact"><div className="dh-container"><Heading eyebrow="Contact" title="Begin Your" accent="Experience" /><div className="dh-contact-grid"><div className="dh-email-panel dh-reveal"><Mail size={32} aria-hidden="true" /><p className="dh-email-kicker">Votre prochain événement commence ici</p><h3>Échangeons directement par e-mail.</h3><p>Décrivez votre date, votre ville et l’idée générale de votre événement. Nous vous répondrons depuis notre équipe 79events.</p><a className="dh-email-link" href="mailto:contact@79events.com?subject=Prise%20de%20contact%20avec%2079events">contact@79events.com <ExternalLink size={15} aria-hidden="true" /></a></div><div className="dh-contact-details dh-reveal"><a href="mailto:contact@79events.com"><Mail size={21} /><span><small>Email</small>contact@79events.com</span></a><div><span><small>Adresse</small>Ouarzazate, Maroc</span></div></div></div></div></section>

    <footer className="dh-footer"><a className="dh-brand" href="#hero" aria-label="79events"><Image src="/images/logo.png" alt="79events" width={90} height={85} className="dh-footer-logo" /></a><span className="dh-short-rule" aria-hidden="true" /><a className="dh-footer-email" href="mailto:contact@79events.com"><Mail size={15} aria-hidden="true" />contact@79events.com</a><div className="dh-social-links"><a href="https://www.instagram.com/79events/" aria-label="Instagram"><Camera size={16} aria-hidden="true" />Instagram</a><a href="https://www.facebook.com/79events"><ExternalLink size={14} aria-hidden="true" />Facebook</a><a href="https://www.youtube.com/@79events"><ExternalLink size={14} aria-hidden="true" />YouTube</a><a href="https://www.tiktok.com/@79events"><ExternalLink size={14} aria-hidden="true" />TikTok</a></div><FooterLegalDetails /><p>© {new Date().getFullYear()} 79events. Tous droits réservés.</p></footer>
    {selected !== null && <div className="dh-lightbox" role="dialog" aria-modal="true" aria-label={dakhlaGallery[selected].caption} onClick={() => setSelected(null)}><button type="button" aria-label="Fermer" onClick={() => setSelected(null)}><X size={24} /></button><Image src={dakhlaImage(dakhlaGallery[selected].image)} alt={dakhlaGallery[selected].caption} fill sizes="90vw" /><p>{dakhlaGallery[selected].caption}</p></div>}
  </main>;
}
