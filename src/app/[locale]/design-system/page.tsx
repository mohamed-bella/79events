import {notFound} from 'next/navigation';
import type {Metadata} from 'next';

export const metadata: Metadata = {title:'Identité visuelle', robots:{index:false,follow:false}};

export default function DesignSystemPage() {
  if (process.env.NODE_ENV === 'production') notFound();
  return <main className="design-system-page"><div className="container"><p className="eyebrow">79 Events · Identité visuelle</p><h1>Les éléments de la marque.</h1><p className="lead-copy">Page de développement uniquement. Non disponible en production et exclue de l’indexation.</p>
    <section className="ds-section"><h2>Couleurs</h2><div className="ds-swatches"><span>Bleu nuit <i style={{background:'#17284d'}} /></span><span>Bleu vif <i style={{background:'#174acb'}} /></span><span>Bleu secondaire <i style={{background:'#5c82c1'}} /></span><span>Gris clair <i style={{background:'#f4f6fb'}} /></span><span>Blanc <i style={{background:'#fff'}} /></span></div></section>
    <section className="ds-section"><h2>Typographie</h2><h3>Titres · Rubik</h3><p>Texte et interface · Rubik — une police unique sur tout le site.</p></section>
    <section className="ds-section"><h2>Boutons</h2><div className="ds-buttons"><a className="button button-blue" href="#">Action principale</a><a className="button button-orange" href="#">Demander une proposition</a><a className="button button-outline-dark" href="#">Action secondaire</a></div></section>
    <section className="ds-section"><h2>Éléments de page</h2><div className="ds-sample-grid"><div className="capability-row"><span className="capability-index">01</span><h3>Titre de section</h3><p>Un texte explicatif facile à parcourir.</p></div><details className="faq-item"><summary><span>Question fréquente</span><span className="faq-count">01</span></summary><p>Une réponse accessible au clavier et avec un lecteur d’écran.</p></details></div></section>
  </div></main>;
}
