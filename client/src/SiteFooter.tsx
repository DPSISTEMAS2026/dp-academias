import { ArrowRight } from 'lucide-react';
import { BRAND, whatsappHref, appPath } from './brand';
import { COMPANY_NAV, companyHref } from './companySite';

type Props = {
  homeHref?: string;
};

export default function SiteFooter({ homeHref = appPath('/') }: Props) {
  return (
    <footer className="dp-footer">
      <div className="dp-footer-brand-block">
        <a className="dp-footer-brand" href={homeHref}>
          <img src={BRAND.logoMark} alt="" />
          <div>
            <strong>{BRAND.companyShort}</strong>
            <span>y Automatizaciones SpA</span>
          </div>
        </a>
        <p className="dp-footer-id">
          {BRAND.legalName} · {BRAND.country}
          <br />
          {BRAND.email}
        </p>
      </div>
      <nav className="dp-footer-links" aria-label="Información legal">
        {COMPANY_NAV.map((item) => (
          <a key={item.id} href={companyHref(item.path)}>{item.label}</a>
        ))}
      </nav>
      <a className="dp-btn dp-btn-solid" href={whatsappHref()} target="_blank" rel="noopener noreferrer">
        Contacto <ArrowRight size={16} />
      </a>
    </footer>
  );
}
