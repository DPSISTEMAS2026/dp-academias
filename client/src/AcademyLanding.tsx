import { GalleryWidget, NewsWidget, ScheduleWidget } from './SiteWidgets';
import type { PublicAcademy } from './tenant';
import { academyLogoSrc } from './brand';
import './AcademyLanding.css';

type Props = {
  academy: PublicAcademy;
  apiUrl: string;
  onLogin: () => void;
};

export default function AcademyLanding({ academy, apiUrl, onLogin }: Props) {
  const logo = academyLogoSrc(academy, apiUrl);
  const color = academy.color || '#006970';

  return (
    <div className="al al-dpdemo" style={{ ['--al-color' as string]: color }}>
      <header className="al-top">
        <div className="al-brand">
          {logo ? <img src={logo} alt="" /> : null}
          <div>
            <b>{academy.name}</b>
            <span>Sitio de la academia</span>
          </div>
        </div>
        <button type="button" className="al-login" onClick={onLogin}>Ingresar</button>
      </header>

      <section className="al-hero dpdemo">
        <p className="al-kicker">{academy.name}</p>
        <h1>La vitrina de la academia.</h1>
        <p>Noticias, horario y galería. Lo que publicas en Sitio web del panel aparece aquí.</p>
      </section>
      <section>
        <h2>Noticias</h2>
        <NewsWidget apiUrl={apiUrl} />
      </section>
      <section>
        <h2>Horario</h2>
        <ScheduleWidget apiUrl={apiUrl} />
      </section>
      <section>
        <h2>Galería</h2>
        <GalleryWidget apiUrl={apiUrl} />
      </section>
    </div>
  );
}
