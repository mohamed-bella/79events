import type {PageKind} from './registry';

type PlannedGroup = {kind:PageKind; paths:string[]};

// Future routes stay unpublished until their own evidence and translated copy are ready.
const groups: Record<string,PlannedGroup> = {
  events:{kind:'event',paths:[
    'events/company-anniversaries','events/company-celebrations','events/corporate-gala-dinners','events/corporate-awards-ceremonies','events/corporate-retreats','events/employee-engagement','events/corporate-networking','events/corporate-hospitality',
    'events/business-meetings','events/board-meetings','events/executive-meetings','events/annual-general-meetings','events/international-conferences','events/medical-conferences','events/academic-conferences','events/industry-summits','events/seminars','events/workshops','events/hybrid-conferences',
    'events/trade-shows','events/trade-fairs','events/business-expos','events/exhibition-stand-design','events/exhibition-management','events/exhibitor-services',
    'events/brand-activations','events/press-conferences','events/media-events','events/promotional-events','events/influencer-events','events/pop-up-events',
    'events/gala-events','events/award-ceremonies','events/festivals','events/cultural-events','events/sporting-events','events/charity-events','events/vip-events',
    'events/private-events','events/luxury-weddings','events/destination-weddings','events/private-celebrations','events/private-parties',
  ]},
  mice:{kind:'hub',paths:['mice/mice-event-planning','mice/mice-event-logistics','mice/mice-venue-sourcing']},
  services:{kind:'service',paths:[
    'services/event-consulting','services/event-concept-design','services/event-budget-management','services/event-project-management','services/event-coordination',
    'services/audio-visual-production','services/sound-and-lighting','services/stage-design','services/event-decoration','services/event-branding','services/led-screens','services/live-streaming','services/event-photography-video',
    'services/event-transportation','services/event-staffing','services/event-security','services/registration-management','services/guest-management','services/vip-management','services/supplier-management',
    'services/event-catering','services/gala-dinner-catering','services/corporate-hospitality','services/vip-hospitality','services/event-accommodation',
    'services/venue-booking','services/conference-venue-sourcing','services/event-space-design','services/venue-management',
  ]},
  locations:{kind:'location',paths:[
    'locations/agadir','locations/fes','locations/essaouira','locations/ouarzazate',
    'locations/marrakech/corporate-events','locations/marrakech/conferences','locations/marrakech/team-building','locations/marrakech/event-venues',
    'locations/casablanca/corporate-events','locations/casablanca/conferences','locations/casablanca/exhibitions','locations/casablanca/event-venues',
    'locations/rabat/corporate-events','locations/rabat/conferences','locations/rabat/event-venues',
    'locations/tangier/corporate-events','locations/tangier/conferences','locations/tangier/event-venues',
  ]},
  venues:{kind:'venues',paths:[
    'venues/conference-centers','venues/convention-centers','venues/corporate-event-hotels','venues/luxury-event-venues','venues/outdoor-event-venues','venues/rooftop-event-venues','venues/exhibition-halls','venues/meeting-rooms','venues/gala-dinner-venues','venues/[venue-slug]',
  ]},
  industries:{kind:'hub',paths:[
    'industries','industries/technology','industries/finance-and-banking','industries/pharmaceutical','industries/automotive','industries/real-estate','industries/healthcare','industries/education','industries/government','industries/nonprofit','industries/associations',
  ]},
  portfolio:{kind:'portfolio',paths:[
    'portfolio/corporate-events','portfolio/conferences','portfolio/exhibitions','portfolio/product-launches','portfolio/gala-dinners','portfolio/team-building','case-studies/[slug]',
  ]},
  resources:{kind:'hub',paths:[
    'resources','resources/how-to-plan-an-event-in-morocco','resources/corporate-event-planning-checklist','resources/conference-planning-checklist','resources/corporate-event-budget','resources/conference-budget-guide','resources/best-cities-for-corporate-events','resources/event-venue-selection-guide','resources/corporate-event-ideas','resources/team-building-ideas','resources/event-permits-in-morocco','resources/event-logistics-guide','resources/mice-morocco-guide','blog','blog/[article-slug]',
  ]},
  about:{kind:'about',paths:[
    'about/our-story','about/our-team','about/our-expertise','about/why-choose-us','about/our-partners','about/testimonials','about/sustainability','about/careers',
  ]},
  leadAndLegal:{kind:'contact',paths:[
    'request-an-event-quote','request-a-venue','schedule-a-consultation','become-a-partner','terms-and-conditions','cookie-policy','event-booking-conditions',
  ]},
};

export const plannedRouteGroups = groups;
export const plannedRouteRecords = Object.entries(groups).flatMap(([section,group]) => group.paths.map((path) => ({
  key:path,
  path,
  section,
  kind:group.kind,
  published:false as const,
  indexable:false as const,
  status:'planned' as const,
  requiresUniqueContent:true,
})));
