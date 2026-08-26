import { useEffect } from 'react';
import { BRAND, whatsappHref, appPath } from './brand';
import { COMPANY_NAV, companyHref, getCompanyDoc, type CompanyPageId } from './companySite';
import SiteFooter from './SiteFooter';
import './ProductLanding.css';
import './CompanyPage.css';

type Props = {
  page: CompanyPageId;
  onLogin: () => void;
};

export default function CompanyPage({ page, onLogin }: Props) {
  const doc = getCompanyDoc(page);
  const loginHref = appPath('/acceso');

  useEffect(() => {
    document.documentElement.classList.add('dp-on-landing');
    document.title = `${doc.title} | ${BRAND.legalName}`;
    window.scrollTo(0, 0);
    return () => {
      document.documentElement.classList.remove('dp-on-landing');
      document.title = `${BRAND.companyShort} | Gestión a medida para academias`;
    };
  }, [doc.title]);

  return (
    <div className="dp-landing dp-company">
      <nav className="dp-nav dp-nav-solid">
        <a className="dp-nav-brand" href={appPath('/')}>
          <img src={BRAND.logoMark} alt="DP Sistemas y Automatizaciones" />
          <div>
            <div className="dp-brand-name">DP Sistemas</div>
            <div className="dp-brand-sub">y Automatizaciones</div>
          </div>
        </a>
        <div className="dp-nav-actions">
          <a className="dp-nav-link" href={`${appPath('/')}#somos`}>Quiénes somos</a>
          <a className="dp-nav-link" href={`${appPath('/')}#plataforma`}>Qué es</a>
          <a className="dp-nav-link" href={`${appPath('/')}#planes`}>Planes</a>
          <a className="dp-nav-link" href={companyHref('/preguntas')}>Preguntas</a>
          <a className="dp-btn dp-btn-ghost" href={whatsappHref()} target="_blank" rel="noopener noreferrer">Solicitar acceso</a>
        </div>
      </nav>

      <div className="dp-company-shell">
        <header className="dp-company-head">
          <div className="dp-kicker">{doc.kicker}</div>
          <h1>{doc.title}</h1>
          <p className="dp-lead">{doc.intro}</p>
          <p className="dp-company-updated">Vigente desde el {BRAND.legalUpdated}</p>
        </header>

        <div className="dp-company-layout">
          <nav className="dp-company-side" aria-label="Documentos de la empresa">
            {COMPANY_NAV.map((item) => (
              <a
                key={item.id}
                href={companyHref(item.path)}
                className={item.id === page ? 'is-active' : undefined}
                aria-current={item.id === page ? 'page' : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <article className="dp-company-doc">
            {doc.faqs ? (
              <div className="dp-faq">
                {doc.faqs.map((item) => (
                  <details key={item.q} className="dp-faq-item">
                    <summary>{item.q}</summary>
                    <p>{item.a}</p>
                  </details>
                ))}
              </div>
            ) : null}

            {doc.blocks.map((block) => (
              <section key={block.heading || block.paragraphs?.[0]} className="dp-doc-block">
                {block.heading ? <h2>{block.heading}</h2> : null}
                {block.paragraphs?.map((text) => <p key={text.slice(0, 48)}>{text}</p>)}
                {block.bullets ? (
                  <ul>
                    {block.bullets.map((item) => <li key={item.slice(0, 48)}>{item}</li>)}
                  </ul>
                ) : null}
              </section>
            ))}

            <p className="dp-company-note">
              Estos textos describen cómo opera {BRAND.legalName} hoy. Pueden actualizarse; la fecha de vigencia está arriba. Para un contrato a la medida de tu academia, escríbenos a {BRAND.email}.
            </p>
            <div className="dp-company-cta">
              <a className="dp-btn dp-btn-solid" href={whatsappHref()} target="_blank" rel="noopener noreferrer">Solicitar acceso a la demo</a>
              <a className="dp-btn dp-btn-line" href={loginHref} onClick={(event) => { event.preventDefault(); onLogin(); }}>Iniciar sesión</a>
            </div>
          </article>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
