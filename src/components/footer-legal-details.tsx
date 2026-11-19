import {company} from '@/lib/company';

export function FooterLegalDetails() {
  const {streetAddress, addressLocality} = company.postalAddress;
  const date = new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(company.foundingDate));

  return (
    <section className="footer-legal-details container" aria-label="Informations légales">
      <span>{company.legalName}</span>
      <span>Siège social : {streetAddress}, {addressLocality}, Maroc</span>
      <span>Création : <time dateTime={company.foundingDate}>{date}</time></span>
      {company.identifiers.map(({propertyID, value}) => (
        <span key={propertyID}>{propertyID} {value}</span>
      ))}
    </section>
  );
}
