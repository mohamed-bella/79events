'use client';

import {usePathname} from 'next/navigation';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {useGSAP} from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function ScrollAnimations() {
  const pathname = usePathname();

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.utils.toArray<HTMLElement>('[data-scroll-reveal], .landing-feature, .landing-related, .company-details, .landing-cta').forEach((element) => {
      gsap.fromTo(element,
        {autoAlpha: 0, y: 28},
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.72,
          ease: 'power2.out',
          scrollTrigger: {trigger: element, start: 'top 86%', once: true},
        },
      );
    });
  }, {dependencies: [pathname], revertOnUpdate: true});

  return null;
}
