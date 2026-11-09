import { useEffect, useState } from "react";
import { defaultSite, loadSite } from "./content.js";
import { getPdf } from "./pdf-store.js";
import { Admin } from "./Admin.jsx";
import { getAppPath, withBase } from "./paths.js";

const routes = [
  { label: "Home", href: "" },
  { label: "Project", href: "projects/" },
  { label: "Daily", href: "daily/" },
  { label: "CV", href: "cv/" },
];

const dailyStories = [
  { place: "Shanghai", year: "2014", image: "assets/daily/shanghai.png", orientation: "portrait", text: "During a Tongji University summer school, I paused on an overpass and watched the traffic gather beneath the bridge, waiting for the lights to change." },
  { place: "The university activity square", year: "2015", image: "assets/daily/university-square.png", orientation: "wide", text: "At a graduation show by the music department, I watched from a distance and began to understand that my own four years at university were coming to an end." },
  { place: "Yantai Train Station", year: "2015", image: "assets/daily/yantai-station.png", orientation: "wide", text: "After graduating, I left my hometown to begin work in another city." },
  { place: "Seaside in Qingdao", year: "2016", image: "assets/daily/qingdao-seaside.png", orientation: "wide", text: "A familiar road between the company and my apartment, passed every day." },
  { place: "The Thames in London", year: "2017", image: "assets/daily/london-thames.png", orientation: "wide", text: "I came to London for further study. On the banks of the Thames, this was the most beautiful scene I found." },
  { place: "The Tower Bridge in London", year: "2018", image: "assets/daily/tower-bridge.png", orientation: "wide", text: "On Christmas Day, I waited for a boat to Westminster Abbey at Tower Bridge - happy to use my camera to record the world." },
  { place: "Hangzhou", year: "2019", image: "assets/daily/hangzhou.png", orientation: "wide", text: "After graduating from Goldsmiths, University of London, I began working in Hangzhou. This daily commute caught the city preparing for the 19th Asian Games." },
  { place: "Lisbon", year: "2019", image: "assets/daily/lisbon.png", orientation: "portrait", text: "The first stop of my graduation trip - a city where every day felt sunny." },
  { place: "Eboliang Yardang in Qinghai", year: "2021", image: "assets/daily/qinghai.png", orientation: "panorama", text: "A landscape that connects people and nature through a vast, fractal structure." },
  { place: "Namcha Barwa in Tibet", year: "2023", image: "assets/daily/tibet.png", orientation: "portrait", text: "Here, time and life seem to extend indefinitely; each person feels small, yet deeply present." },
  { place: "Hong Kong", year: "2024", image: "assets/daily/hong-kong.png", orientation: "portrait", text: "After the pandemic, I travelled to Hong Kong and photographed the Central-Mid-Levels Escalator." },
];

function Header({ current, site }) {
  return (
    <header className="site-header" style={{ position: "sticky", top: 0, zIndex: 50, background: "#fbfbfa", borderBottom: "1px solid #d9dee1" }}>
      <a className="wordmark" href={withBase()}>{site?.name || "Wenzhe Xu"}</a>
      <nav aria-label="Main navigation">
        {routes.map((route) => (
          <a key={route.href} href={withBase(route.href)} aria-current={current === route.label ? "page" : undefined}>{route.label}</a>
        ))}
      </nav>
    </header>
  );
}

function Footer() { return <footer>Last updated: {import.meta.env.VITE_BUILD_DATE}</footer>; }

function Home({ site }) {
  const frameStyle = { width: `min(${site.design.contentWidth}px, calc(100% - 48px))` };
  const intro = Array.isArray(site.intro) ? site.intro : [];
  const news = Array.isArray(site.news) ? site.news : [];
  return (
    <div className="site-frame" style={frameStyle}>
      <Header current="Home" site={site} />
      <main className="home-page" style={{ paddingTop: site.design.pageTop }}>
        <section className="intro-grid">
          <div className="portrait-column"><img className="portrait" src={withBase(site.portrait)} alt={site.name} /></div>
          <div className="intro-copy">
            <h1>{site.headline}</h1>
            {intro.map((paragraph, index) => <p key={index} style={{ fontSize: site.design.bodyFontSize }}>{paragraph}</p>)}
            <div className="contact-links">
              {site.contactVisibility.email && <a href={`mailto:${site.email}`}>[email]</a>}
              {site.contactVisibility.github && <a href={site.github} target="_blank" rel="noreferrer">[github]</a>}
              {site.contactVisibility.linkedin && <a href={site.linkedin} target="_blank" rel="noreferrer">[linkedin]</a>}
            </div>
          </div>
        </section>
        {site.newsVisible && (
          <section className="news">
            <h2>news</h2>
            <ul>{news.filter((item) => item.visible !== false && item.dateVisible !== false).map((item) => <li key={item.date + item.text}><strong>{item.date}</strong>{" "}{item.text}</li>)}</ul>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

function ProjectImage({ index, src, alt }) {
  if (src) return <img className="project-image" src={withBase(src)} alt={alt} style={{ height: "auto", aspectRatio: "auto", objectFit: "contain" }} />;
  return <div className="project-image project-image-pending" role="img" aria-label={`${alt} image pending`}><span>PROJECT {String(index + 1).padStart(2, "0")}</span><small>Replace with your project image</small></div>;
}

function Projects({ site }) {
  const frameStyle = { width: `min(${Math.max(site.design.contentWidth, 1120)}px, calc(100% - 48px))` };
  const visibleProjects = site.projects
    .map((project, index) => ({ project, index }))
    .filter(({ project }) => project.visible !== false);
  return (
    <div className="site-frame project-frame" style={frameStyle}>
      <Header current="Project" site={site} />
      <main className="projects-page" style={{ paddingTop: site.design.pageTop }}>
        <div className="project-list">
          {visibleProjects.map(({ project, index }, visibleIndex) => (
            <article className="project" key={project.storageKey || project.title} style={{ marginBottom: site.design.projectMarginBottom ?? 24 }}>
              <h2>{project.title}</h2>
              <div className="project-grid">
                <a href={withBase(`project/?id=${index}`)} aria-label={`Open ${project.title} details`} style={{ display: "block", color: "inherit", textDecoration: "none" }}><ProjectImage index={visibleIndex} src={project.image} alt={project.title} /></a>
                <div className="project-copy"><h3>{project.period}</h3><p>{project.summary}</p><p>{project.detail}</p><a href={withBase(`project/?id=${index}`)}>Project details</a></div>
              </div>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Daily({ site }) {
  const frameStyle = { width: `min(${Math.max(site.design.contentWidth, 1120)}px, calc(100% - 48px))` };
  const [activeStory, setActiveStory] = useState(null);
  const [activeGallery, setActiveGallery] = useState([]);
  const daily = site.daily || {};
  const photography = Array.isArray(daily.photography) ? daily.photography : dailyStories;
  const cooking = daily.cooking || { subtitle: "Kitchen notes", text: "Recipes and small pleasures from the kitchen are being collected here.", items: [] };
  const cat = daily.cat || { subtitle: "Daily company", text: "A corner for quiet naps, curious moments, and life with a cat.", items: [] };
  const sections = [
    { key: "cat", index: "01", title: "Cat", subtitle: cat.subtitle, stories: Array.isArray(cat.items) ? cat.items : [], empty: cat.text },
    { key: "cooking", index: "02", title: "Cooking", subtitle: cooking.subtitle, stories: Array.isArray(cooking.items) ? cooking.items : [], empty: cooking.text },
    { key: "photography", index: "03", title: "Photography", subtitle: "2014 - 2024", stories: photography, empty: "No photography entries yet." },
  ];
  const showStory = (offset) => setActiveStory((current) => {
    const currentIndex = activeGallery.indexOf(current);
    const nextIndex = (Math.max(0, currentIndex) + offset + activeGallery.length) % activeGallery.length;
    return activeGallery[nextIndex];
  });
  useEffect(() => {
    if (!activeStory) return undefined;
    const handleKeydown = (event) => {
      if (event.key === "Escape") setActiveStory(null);
      if (event.key === "ArrowLeft") { event.preventDefault(); showStory(-1); }
      if (event.key === "ArrowRight") { event.preventDefault(); showStory(1); }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [activeStory, activeGallery]);
  const renderGallery = (stories, label) => {
    const visibleStories = stories.filter((story) => story.visible !== false);
    if (!visibleStories.length) return <div className="daily-empty"><p>{label}</p></div>;
    return <div className="daily-gallery" aria-label={`${label} archive`}>
      {visibleStories.map((story, index) => (
        <article className={`daily-card daily-card--${story.orientation || "wide"}`} key={`${story.place}-${story.year}-${index}`}>
          <button className="daily-image-wrap" type="button" onClick={() => { setActiveGallery(visibleStories); setActiveStory(story); }} aria-label={`View ${story.place} photograph`}><img src={withBase(story.image)} alt={`${story.place}, ${story.year}`} loading={index < 4 ? "eager" : "lazy"} /></button>
          <div className="daily-card-copy"><p className="daily-meta">{story.year}</p><h2>{story.place}</h2><p>{story.text}</p></div>
        </article>
      ))}
    </div>;
  };
  return (
    <div className="site-frame daily-frame" style={frameStyle}>
      <Header current="Daily" site={site} />
      <nav className="daily-categories" aria-label="Daily categories">
        <a href="#cat" aria-label="Cat">🐱</a><a href="#cooking" aria-label="Cooking">🍱</a><a href="#photography" aria-label="Photography">📷</a>
      </nav>
      <main className="daily-page">
        {sections.map((section) => <section className="daily-section" id={section.key} aria-labelledby={`${section.key}-title`} key={section.key}><div className="daily-section-heading"><p>{section.index}</p><div><h2 id={`${section.key}-title`}>{section.title}</h2><span>{section.subtitle}</span></div></div>{renderGallery(section.stories, section.empty)}</section>)}
        {activeStory && <div className="photo-lightbox" role="dialog" aria-modal="true" aria-label={`${activeStory.place} photograph`} onClick={() => setActiveStory(null)}><button className="photo-lightbox-close" type="button" aria-label="Close image viewer" onClick={() => setActiveStory(null)}>×</button><button className="photo-lightbox-nav photo-lightbox-prev" type="button" aria-label="Previous photograph" onClick={(event) => { event.stopPropagation(); showStory(-1); }}>‹</button><figure onClick={(event) => event.stopPropagation()}><img src={withBase(activeStory.image)} alt={`${activeStory.place}, ${activeStory.year}`} /><figcaption><strong>{activeStory.place}</strong><span>{activeStory.year}</span></figcaption></figure><button className="photo-lightbox-nav photo-lightbox-next" type="button" aria-label="Next photograph" onClick={(event) => { event.stopPropagation(); showStory(1); }}>›</button></div>}
      </main>
      <Footer />
    </div>
  );
}

function PdfDocument({ storageKey, fallback = "", title, emptyMessage = "No PDF has been uploaded yet.", useLocal = true, showOpenButton = false }) {
  const [url, setUrl] = useState(fallback);
  useEffect(() => {
    if (!useLocal) {
      setUrl(fallback);
      return undefined;
    }
    let objectUrl = "";
    getPdf(storageKey).then((file) => {
      if (file) { objectUrl = URL.createObjectURL(file); setUrl(objectUrl); }
    });
    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [fallback, storageKey, useLocal]);
  if (!url) return <div className="pdf-empty" style={{ width: "min(1120px, 100%)", height: "100%", margin: "0 auto", padding: "72px", background: "#fff" }}><h1 style={{ marginTop: 0 }}>{title}</h1><p>{emptyMessage}</p><a href={withBase("admin/")}>Upload PDF in the visual editor</a></div>;
  return <>
    {showOpenButton && <a href={url} target="_blank" rel="noreferrer" aria-label={`Open ${title} PDF in a new tab`} style={{ position: "absolute", top: 16, right: "max(24px, calc((100% - 1120px) / 2))", zIndex: 2, display: "inline-block", padding: "8px 12px", border: "1px solid #cfd4d7", background: "#fff", color: "#202632", fontFamily: "var(--sans)", fontSize: 13, textDecoration: "none" }}>Full-screen PDF ↗</a>}
    <object data={url} type="application/pdf" aria-label={title}><p><a href={url}>Open PDF</a></p></object>
  </>;
}

function CV({ site, useLocalPdf }) {
  const fallback = site.cvPdfPath ? withBase(site.cvPdfPath) : "";
  return <div className="cv-page" style={{ background: "#fbfbfa" }}><div className="site-frame cv-header-frame" style={{ position: "sticky", top: 0, zIndex: 50, background: "#fbfbfa" }}><Header current="CV" site={site} /></div><main className="pdf-shell" style={{ height: "calc(clamp(420px, 70.7vw, 792px) + 88px)", paddingTop: 32 }}><PdfDocument storageKey="cv" fallback={fallback} title="Wenzhe Xu CV" useLocal={useLocalPdf} /></main><div className="site-frame cv-footer-frame"><Footer /></div></div>;
}

function ProjectPdf({ site, useLocalPdf }) {
  const id = Math.max(0, Math.min(site.projects.length - 1, Number(new URLSearchParams(window.location.search).get("id")) || 0));
  const project = site.projects[id];
  if (!project || project.visible === false) {
    return <div className="cv-page" style={{ background: "#fbfbfa" }}><div className="site-frame cv-header-frame"><Header current="Project" site={site} /></div><main className="site-frame projects-page"><h1>Project unavailable</h1><p>This project is currently hidden.</p><a href={withBase("projects/")}>← Back to projects</a></main></div>;
  }
  const fallback = project.pdfPath ? withBase(project.pdfPath) : "";
  return <div className="cv-page" style={{ background: "#fbfbfa" }}><div className="site-frame cv-header-frame" style={{ position: "sticky", top: 0, zIndex: 50, background: "#fbfbfa" }}><Header current="Project" site={site} /></div><main className="pdf-shell" style={{ paddingTop: 64, position: "relative" }}><a href={withBase("projects/")} style={{ position: "absolute", top: 16, left: "max(24px, calc((100% - 1120px) / 2))", display: "inline-block", padding: "8px 12px", border: "1px solid #cfd4d7", background: "#fff", color: "#202632", fontFamily: "var(--sans)", fontSize: 13, textDecoration: "none" }}>← Back to projects</a><PdfDocument storageKey={project.storageKey || `project-${id}`} fallback={fallback} title={project.title} emptyMessage="No PDF has been uploaded for this project yet." useLocal={useLocalPdf} showOpenButton /></main><div className="site-frame cv-footer-frame"><Footer /></div></div>;
}

function PublicSite({ path }) {
  const isHostedSite = window.location.hostname.endsWith("github.io");
  const useLocalDraft = !isHostedSite || new URLSearchParams(window.location.search).has("edit");
  const [site, setSite] = useState(() => useLocalDraft ? loadSite() : defaultSite);

  useEffect(() => {
    if (useLocalDraft) {
      setSite(loadSite());
      return undefined;
    }

    let cancelled = false;
    fetch(`${withBase("site-content.json")}?v=${Date.now()}`, { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error(`Unable to load site content (${response.status})`);
        return response.json();
      })
      .then((content) => { if (!cancelled) setSite(content); })
      .catch(() => { if (!cancelled) setSite(defaultSite); });
    return () => { cancelled = true; };
  }, [useLocalDraft]);

  if (path.startsWith("/projects")) return <Projects site={site} />;
  if (path.startsWith("/project/")) return <ProjectPdf site={site} useLocalPdf={useLocalDraft} />;
  if (path.startsWith("/daily")) return <Daily site={site} />;
  if (path.startsWith("/cv")) return <CV site={site} useLocalPdf={useLocalDraft} />;
  return <Home site={site} />;
}

export function App() {
  const path = getAppPath();
  if (path.startsWith("/admin")) return <Admin />;
  return <PublicSite path={path} />;
}
