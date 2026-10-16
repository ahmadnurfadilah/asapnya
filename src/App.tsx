import { EditorPanel } from './components/EditorPanel'
import { GITHUB_REPO_URL, INSPIRATION_TWEET_URL } from './lib/constants'

function ExternalLinkIcon() {
  return (
    <svg
      className="footer-link-icon"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 17L17 7M17 7H9M17 7V15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function App() {
  return (
    <div className="app">
      <header className="site-header">
        <span className="logo" aria-label="Asapnya">
          Asap<span>nya</span>
        </span>
      </header>

      <main className="screen">
        <section className="workspace" aria-label="Buat foto profil">
          <EditorPanel />
        </section>

        <section className="copy" aria-labelledby="hero-title">
          <p className="eyebrow">Jadikan foto profilmu pengingat</p>
          <h1 id="hero-title">
            Asapnya di foto.
            <br />
            <em>Isunya nyata.</em>
          </h1>
          <p className="hero-lead">
            Ingatkan diri sendiri dan orang lain bahwa asap karhutla (pembakaran
            hutan dan lahan) masih ada. Terus suarakan dan bantu semampumu,
            sampai tuntas, sampai tak ada lagi yang menderita.
          </p>
        </section>
      </main>

      <footer className="site-footer">
        <a
          className="footer-link"
          href={INSPIRATION_TWEET_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Inspirasi
          <ExternalLinkIcon />
        </a>
        <span className="footer-sep" aria-hidden="true">·</span>
        <a
          className="footer-link"
          href={GITHUB_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
          <ExternalLinkIcon />
        </a>
      </footer>
    </div>
  )
}

export default App
