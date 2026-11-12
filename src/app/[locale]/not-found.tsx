'use client';

import {ArrowUpRight} from 'lucide-react';
import {Link} from '@/i18n/routing';

export default function NotFound() {
  return <main className="not-found-page"><div className="container"><p className="eyebrow">404 · Page introuvable</p><h1>Cette page n’est pas disponible.</h1><p>Le contenu demandé peut avoir été déplacé ou n’est pas encore publié.</p><Link className="button button-blue" href="/">Retour à l’accueil<ArrowUpRight size={16} /></Link></div></main>;
}
