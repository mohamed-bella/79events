'use client';

import {useEffect, useState, type FormEvent} from 'react';
import Image from 'next/image';
import {Award, BriefcaseBusiness, Camera, Clapperboard, Crown, Globe2, Handshake, Heart, Mail, MapPin, Menu, MessageCircle, Monitor, Phone, Shield, Sparkles, X} from 'lucide-react';
import {dakhlaExpertise, dakhlaGallery, dakhlaImage, dakhlaReach, dakhlaServices, heroImages} from '@/content/dakhla';

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

function ContactForm() {
  const send = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const subject = `Demande d'événement — ${form.get('eventType') || 'Dakhla Events'}`;
    const body = `Nom : ${form.get('name')}\nEmail : ${form.get('email')}\nTéléphone : ${form.get('phone')}\nType : ${form.get('eventType')}\nDate : ${form.get('date')}\nBudget : ${form.get('budget')}\n\n${form.get('message')}`;
    window.location.href = `mailto:contact@dakhlaevents.ma?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  return <form className="dh-form" onSubmit={send}>
    <div className="dh-form-grid">
      <input name="name" required placeholder="Nom Complet" aria-label="Nom Complet" autoComplete="name" />
      <input name="email" required type="email" placeholder="Email" aria-label="Email" autoComplete="email" />
      <input name="phone" type="tel" placeholder="Téléphone" aria-label="Téléphone" autoComplete="tel" />
      <select name="eventType" aria-label="Type d’événement" defaultValue=""><option value="" disabled>Type d’événement</option><option>Mariage</option><option>Gala & Soirée Privée</option><option>Événement Corporate</option><option>Lancement de Produit</option><option>Séminaire & Conférence</option><option>Incentive & Team Building</option><option>Autre</option></select>
      <input name="date" type="date" aria-label="Date de l’événement" />
      <select name="budget" aria-label="Budget approximatif" defaultValue=""><option value="" disabled>Budget approximatif</option><option>&lt; 100 000 MAD</option><option>100 000 – 300 000 MAD</option><option>300 000 – 500 000 MAD</option><option>500 000 – 1 000 000 MAD</option><option>&gt; 1 000 000 MAD</option></select>
    </div>
    <textarea name="message" rows={4} placeholder="Décrivez votre événement…" aria-label="Décrivez votre événement" />
    <button type="submit">Envoyer</button>
  </form>;
}

export function DakhlaPage() {
  const [slide, setSlide] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setSlide((current) => (current + 1) % heroImages.length), 5000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold: 0.1});
    document.querySelectorAll('.dh-reveal').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen && selected === null) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {setMenuOpen(false); setSelected(null);}
    };
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, [menuOpen, selected]);

  return <main className="dakhla-home">
    <header className="dh-header">
      <a className="dh-brand" href="#hero">DAKHLA<span>EVENTS</span></a>
      <nav className={menuOpen ? 'dh-nav is-open' : 'dh-nav'} aria-label="Navigation principale">{navigation.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}</nav>
      <button className="dh-menu" type="button" aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
    </header>

    <section className="dh-hero" id="hero">
      {heroImages.map((name, index) => <div className={index === slide ? 'dh-hero-slide is-active' : 'dh-hero-slide'} key={name}><Image src={dakhlaImage(name)} alt="" fill priority={index === 0} sizes="100vw" /></div>)}
      <div className="dh-hero-shade" />
      <div className="dh-hero-content"><p>Agence Événementielle de Prestige</p><h1>L&apos;Art de l&apos;<em>Exclusivité</em></h1><span className="dh-wide-rule" aria-hidden="true" /><p className="dh-hero-lead">Des expériences sur-mesure au cœur du Sahara et de l&apos;Atlantique.<br />Mariages, galas, lancements — chaque détail est une signature.</p></div>
      <div className="dh-dots" aria-label="Choisir une image">{heroImages.map((name, index) => <button key={name} className={index === slide ? 'is-active' : ''} type="button" onClick={() => setSlide(index)} aria-label={`Afficher l’image ${index + 1}`} aria-current={index === slide ? 'true' : undefined} />)}</div>
      <a className="dh-discover" href="#services">Découvrir</a>
    </section>

    <section className="dh-services" id="services"><div className="dh-container">
      <Heading eyebrow="Nos Expertises" title="Des Services d’" accent="Excellence" />
      <div className="dh-service-cards">{dakhlaServices.map(({title, icon, lead}, index) => <a className="dh-service-card dh-reveal" href={`#service-${index}`} key={title}><GoldIcon name={icon} /><h3>{title}</h3><p>{lead}</p></a>)}</div>
      <div className="dh-service-stories">{dakhlaServices.map(({title, icon, image, lead, detail}, index) => <article className={`dh-story dh-reveal${index % 2 ? ' is-reversed' : ''}`} id={`service-${index}`} key={title}><div className="dh-story-image"><Image src={dakhlaImage(image)} alt={title} fill sizes="(max-width: 760px) 100vw, 48vw" /></div><div className="dh-story-copy"><GoldIcon name={icon} /><h3>{title}</h3><span className="dh-short-rule" aria-hidden="true" /><p>{lead}</p><p>{detail}</p></div></article>)}</div>
    </div></section>

    <section className="dh-expertise"><div className="dh-container"><Heading eyebrow="Savoir-Faire" title="Notre" accent="Expertise" /><div className="dh-expertise-grid">{dakhlaExpertise.map(({title, icon, text}) => <article className="dh-expertise-card dh-reveal" key={title}><span><GoldIcon name={icon} /></span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

    <section className="dh-gallery-section" id="gallery"><div className="dh-container"><Heading eyebrow="Portfolio" title="Nos" accent="Réalisations" /><p className="dh-intro dh-reveal">Chaque événement est une création unique. Découvrez quelques-unes de nos réalisations les plus marquantes, du Sahara à l’Atlantique.</p><div className="dh-gallery">{dakhlaGallery.map(({image, caption}, index) => <button className="dh-gallery-item dh-reveal" key={image} type="button" onClick={() => setSelected(index)} aria-label={`Voir ${caption}`}><Image src={dakhlaImage(image)} alt={caption} fill sizes="(max-width: 700px) 50vw, 33vw" /><span>{caption}</span></button>)}</div></div></section>

    <section className="dh-about" id="about"><div className="dh-container"><Heading eyebrow="Notre Histoire" title="L’Excellence a une" accent="Adresse" /><div className="dh-about-grid"><div className="dh-about-copy dh-reveal"><span className="dh-short-rule" aria-hidden="true" /><p>Depuis plus d’une décennie, Dakhla Events transforme la perle du Sahara en scène d’expériences inoubliables. Notre connaissance intime du territoire, combinée à un réseau de partenaires internationaux, nous permet de créer des événements à la hauteur des plus grandes exigences.</p><p>Chaque projet est une collaboration étroite avec nos clients — marques de luxe, familles royales, entreprises du Fortune 500 — pour concevoir des moments qui transcendent l’ordinaire.</p><p>Notre équipe pluridisciplinaire — designers, scénographes, directeurs artistiques et coordinateurs terrain — travaille en synergie pour orchestrer chaque détail. Du concept initial à la réalisation finale, nous garantissons une exécution irréprochable et une expérience qui dépasse toutes les attentes.</p></div><div className="dh-about-image dh-reveal"><Image src={dakhlaImage('hero-event')} alt="L’équipe Dakhla Events en action lors d’un événement de prestige" fill sizes="(max-width: 760px) 100vw, 48vw" /></div></div><div className="dh-stats dh-reveal"><div><strong>150+</strong><span>Événements</span></div><div><strong>12</strong><span>Années d’Excellence</span></div><div><strong>100%</strong><span>Sur-Mesure</span></div></div></div></section>

    <section className="dh-reach"><div className="dh-container"><Heading eyebrow="Global Reach" title="International Standards —" accent="Local Mastery" /><p className="dh-intro dh-reveal">Nous combinons les standards de qualité internationaux avec une maîtrise inégalée du territoire de Dakhla, offrant à nos clients le meilleur des deux mondes.</p><div className="dh-reach-grid">{dakhlaReach.map(({title, icon, text}) => <article className="dh-reveal" key={title}><GoldIcon name={icon} /><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

    <section className="dh-instagram"><div className="dh-container"><Camera size={29} strokeWidth={1.3} aria-hidden="true" /><Heading eyebrow="@DakhlaEvents" title="Suivez nos" accent="Coulisses" /><div className="dh-instagram-grid" aria-hidden="true">{Array.from({length: 6}, (_, index) => <span key={index}><Camera size={19} /></span>)}</div><a href="https://www.instagram.com/dakhlaevents.ma/" target="_blank" rel="noopener noreferrer">Voir sur Instagram</a></div></section>

    <section className="dh-contact" id="contact"><div className="dh-container"><Heading eyebrow="Contact" title="Begin Your" accent="Experience" /><div className="dh-contact-grid"><ContactForm /><div className="dh-contact-details"><a href="mailto:contact@dakhlaevents.ma"><Mail size={21} /><span><small>Email</small>contact@dakhlaevents.ma</span></a><a href="tel:+212663322302"><Phone size={21} /><span><small>Téléphone</small>+212 663 32 23 02</span></a><div><MapPin size={21} /><span><small>Adresse</small>Dakhla, Morocco</span></div><iframe title="Carte de Dakhla" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=Dakhla%2C%20Morocco&t=&z=12&ie=UTF8&iwloc=&output=embed" /></div></div></div></section>

    <footer className="dh-footer"><a className="dh-brand" href="#hero">DAKHLA<span>EVENTS</span></a><span className="dh-short-rule" aria-hidden="true" /><div><a href="https://www.instagram.com/dakhlaevents.ma/" aria-label="Instagram"><Camera size={18} /></a><a href="https://www.facebook.com/dakhlaevents" aria-label="Facebook">f</a><a href="https://www.youtube.com/@dakhlaevents" aria-label="YouTube">▶</a><a href="https://www.tiktok.com/@dakhlaevents" aria-label="TikTok">♪</a></div><p>© {new Date().getFullYear()} Dakhla Events. Tous droits réservés.</p></footer>
    <a className="dh-chat" href="https://wa.me/212663322302" target="_blank" rel="noopener noreferrer" aria-label="Contacter Dakhla Events sur WhatsApp"><MessageCircle size={24} fill="white" strokeWidth={1.5} /></a>
    {selected !== null && <div className="dh-lightbox" role="dialog" aria-modal="true" aria-label={dakhlaGallery[selected].caption} onClick={() => setSelected(null)}><button type="button" aria-label="Fermer" onClick={() => setSelected(null)}><X size={24} /></button><Image src={dakhlaImage(dakhlaGallery[selected].image)} alt={dakhlaGallery[selected].caption} fill sizes="90vw" /><p>{dakhlaGallery[selected].caption}</p></div>}
  </main>;
}
