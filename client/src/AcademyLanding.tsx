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
  const layout = academy.slug === 'diego' ? 'diego' : 'dpdemo';
  const logo = academyLogoSrc(academy, apiUrl);
  const color = academy.color || '#006970';

  return (
    <div className={`al al-${layout}`} style={{ ['--al-color' as string]: color }}>
      <header className="al-top">
        <div className="al-brand">
          {logo ? <img src={logo} alt="" /> : null}
          <div>
            <b>{academy.name}</b>
            <span>Página de prueba · widgets del panel</span>
          </div>
        </div>
        <button type="button" className="al-login" onClick={onLogin}>Ingresar</button>
      </header>

      {layout === 'diego' ? (
        <>
          <section className="al-hero diego">
            <p className="al-kicker">Academia Diego</p>
            <h1>Entrená con nosotros.</h1>
            <p>Esta landing es distinta a DPDEMO: galería primero, noticias al costado. El contenido lo publica el admin.</p>
          </section>
          <div className="al-split">
            <section>
              <h2>Galería</h2>
              <GalleryWidget apiUrl={apiUrl} />
            </section>
            <aside>
              <h2>Novedades</h2>
              <NewsWidget apiUrl={apiUrl} />
              <h2>Horario</h2>
              <ScheduleWidget apiUrl={apiUrl} />
            </aside>
          </div>
        </>
      ) : (
        <>
          <section className="al-hero dpdemo">
            <p className="al-kicker">DPDEMO</p>
            <h1>La vitrina de la academia.</h1>
            <p>Noticias arriba, horario y galería abajo. Si cambiás Sitio web en el panel, esto se actualiza.</p>
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
        </>
      )}
    </div>
  );
}
