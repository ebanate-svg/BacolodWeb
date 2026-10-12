import { FormEvent, ReactNode, useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { bidItems, businesses, jobs, news as fallbackNews, services, type NewsItem } from './data'
import { firebaseReady, loadLatestNews, submitRequest } from './firebase'

const asset = (name: string) => `${import.meta.env.BASE_URL}images/${name}`
const formatNewsDate = (value: string) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }).format(
        date,
      )
}

function AppDownloadBadges({ className = 'app-downloads' }: { className?: string }) {
  return (
    <div className={className} aria-label="Download the Bacolod eGov mobile app">
      <a
        className="store-badge"
        href="https://play.google.com/store/apps/details?id=co.fortistech.bacolodgapp"
        target="_blank"
        rel="noreferrer"
        aria-label="Get it on Google Play"
      >
        <svg className="google-play-icon" viewBox="0 0 32 34" aria-hidden="true">
          <path fill="#21c45b" d="M2 2.7v28.6L18.5 17 2 2.7Z" />
          <path fill="#23a8f2" d="m2 2.7 20.2 11.7-3.7 2.6L2 2.7Z" />
          <path fill="#f8c62b" d="m2 31.3 20.2-11.7-3.7-2.6L2 31.3Z" />
          <path fill="#f14b3f" d="m22.2 14.4 5.2 3c1 .6 1 1.5 0 2.1l-5.2 3-3.7-5.5 3.7-2.6Z" />
        </svg>
        <span>
          <small>GET IT ON</small>
          <b>Google Play</b>
        </span>
      </a>
      <a className="store-badge" href="#app-store" aria-label="Download on the App Store">
        <svg className="apple-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17.05 12.54c-.03-3.19 2.61-4.74 2.73-4.82a5.86 5.86 0 0 0-4.61-2.5c-1.94-.2-3.82 1.16-4.81 1.16-1.02 0-2.56-1.14-4.21-1.1a6.13 6.13 0 0 0-5.16 3.15c-2.23 3.86-.57 9.53 1.57 12.65 1.07 1.53 2.31 3.24 3.96 3.18 1.61-.07 2.21-1.02 4.15-1.02 1.92 0 2.49 1.02 4.17.98 1.73-.03 2.82-1.53 3.85-3.08a12.62 12.62 0 0 0 1.76-3.58 5.56 5.56 0 0 1-3.4-5.02ZM13.9 3.17A5.63 5.63 0 0 0 15.18-.88a5.74 5.74 0 0 0-3.72 1.93 5.36 5.36 0 0 0-1.31 3.9 4.74 4.74 0 0 0 3.75-1.78Z" />
        </svg>
        <span>
          <small>Download on the</small>
          <b>App Store</b>
        </span>
      </a>
    </div>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  return (
    <header className="site-header">
      <div className="nav-shell">
        <Link className="logo-link" to="/" aria-label="Bacolod City home">
          <img src={asset('bacolodLogo.png')} alt="Bacolod City" />
        </Link>
        <button
          className="menu-toggle"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          ☰
        </button>
        <nav
          className={open ? 'is-open' : ''}
          onClick={() => {
            setOpen(false)
            setServicesOpen(false)
          }}
        >
          <NavLink to="/">Home</NavLink>
          <span
            className="nav-dropdown"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
            onFocus={() => setServicesOpen(true)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setServicesOpen(false)
            }}
          >
            <button
              aria-haspopup="true"
              aria-expanded={servicesOpen}
              onClick={(event) => {
                event.stopPropagation()
                setServicesOpen((value) => !value)
              }}
            >
              Services <b>⌄</b>
            </button>
            <span className={servicesOpen ? 'dropdown is-open' : 'dropdown'}>
              <Link to="/services">Online Services</Link>
              <Link to="/waste">Waste Management</Link>
              <Link to="/local-business">Local Business</Link>
              <Link to="/jobs">Job Listings</Link>
            </span>
          </span>
          <NavLink to="/tourism">Tourism</NavLink>
          <NavLink to="/jobs">Jobs</NavLink>
          <NavLink to="/bids">Bids</NavLink>
          <NavLink to="/civic">Resources</NavLink>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <>
      <section className="future-section">
        <h2>
          Be Part of Bacolod’s
          <br />
          Digital Future
        </h2>
        <p>
          Join thousands of citizens embracing a smarter,
          <br />
          more connected city.
          <br />
          Download the app
        </p>
        <AppDownloadBadges className="future-downloads" />
      </section>
      <footer id="contact">
        <div className="footer-grid page-width">
          <img src={asset('bacolodLogo.png')} alt="Bacolod City" />
          <div>
            <h3>Services</h3>
            <Link to="/services">Local Government Service</Link>
            <Link to="/civic">Community Notices & Events</Link>
            <Link to="/waste">Waste Management</Link>
            <Link to="/jobs">Local Business & Job Listings</Link>
          </div>
          <div>
            <h3>Explore</h3>
            <Link to="/tourism">Local Tourism & Recreation</Link>
            <Link to="/bids">Public Bids & Procurement</Link>
            <Link to="/civic">Civic Engagement</Link>
          </div>
          <div>
            <h3>Legal</h3>
            <a href="#terms">Terms and Conditions</a>
            <a href="#privacy">Privacy Policy</a>
          </div>
        </div>
        <div className="footer-bottom page-width">
          <span>
            © 2026 – City Government of Bacolod
            <br />
            <small>ALL RIGHTS RESERVED</small>
          </span>
          <span>● ◉ in</span>
        </div>
      </footer>
    </>
  )
}

function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}

function Title({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string
  title: ReactNode
  description?: string
}) {
  return (
    <div className="section-title">
      {eyebrow && <span>{eyebrow}</span>}
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  )
}

function Home() {
  const [news, setNews] = useState<NewsItem[]>(fallbackNews)
  const [newsIsLive, setNewsIsLive] = useState(false)
  useEffect(() => {
    let active = true
    async function fetchNews() {
      const result = await loadLatestNews(fallbackNews)
      if (active) {
        setNews(result.items)
        setNewsIsLive(result.isLive)
      }
    }
    void fetchNews()
    return () => {
      active = false
    }
  }, [])
  return (
    <div className="landing-page">
      <section className="landing-hero">
        <img src={asset('slider1.png')} alt="MassKara Festival dancers" />
        <div>
          <h1>
            Empowering Bacolod
            <br />
            Through Digital Governance
          </h1>
          <p>
            Access essential city services and updates from your computer or mobile device—anytime,
            anywhere.
          </p>
          <Link className="button button-outline" to="/services">
            Get Started
          </Link>
        </div>
        <img src={asset('slider2.png')} alt="Bacolod community" />
      </section>
      <AppDownloadBadges />
      <section className="portal-section page-width">
        <div>
          <h2>
            One City.
            <br />
            <em>One Digital Platform.</em>
          </h2>
          <p>Transforming governance through digital innovation</p>
        </div>
        <div className="portal-card">
          <div className="portal-card__heading">
            <div className="portal-icon" aria-hidden="true">
              <svg
                width="22"
                height="18"
                viewBox="0 0 22 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.175 6.60002C21.6219 6.60002 22 6.97815 22 7.42502V16.5C22 17.1188 21.4844 17.6 20.9 17.6H1.1C0.48125 17.6 0 17.1188 0 16.5V4.12502C0 3.67815 0.34375 3.30002 0.825 3.30002H2.2V0.550024C2.2 0.275024 2.44063 2.40803e-05 2.75 2.40803e-05H3.3C3.575 2.40803e-05 3.85 0.275024 3.85 0.550024V3.30002H6.05V0.550024C6.05 0.275024 6.29063 2.40803e-05 6.6 2.40803e-05H7.15C7.425 2.40803e-05 7.7 0.275024 7.7 0.550024V3.30002H9.9V0.825024C9.9 0.378149 10.2438 2.40803e-05 10.725 2.40803e-05H15.675C16.1219 2.40803e-05 16.5 0.378149 16.5 0.825024V6.60002H21.175ZM4.4 13.8875V12.5125C4.4 12.3063 4.19375 12.1 3.9875 12.1H2.6125C2.37188 12.1 2.2 12.3063 2.2 12.5125V13.8875C2.2 14.1281 2.37188 14.3 2.6125 14.3H3.9875C4.19375 14.3 4.4 14.1281 4.4 13.8875ZM4.4 10.5875V9.21252C4.4 9.00627 4.19375 8.80002 3.9875 8.80002H2.6125C2.37188 8.80002 2.2 9.00627 2.2 9.21252V10.5875C2.2 10.8281 2.37188 11 2.6125 11H3.9875C4.19375 11 4.4 10.8281 4.4 10.5875ZM4.4 7.28752V5.91252C4.4 5.70627 4.19375 5.50002 3.9875 5.50002H2.6125C2.37188 5.50002 2.2 5.70627 2.2 5.91252V7.28752C2.2 7.52815 2.37188 7.70002 2.6125 7.70002H3.9875C4.19375 7.70002 4.4 7.52815 4.4 7.28752ZM8.8 13.8875V12.5125C8.8 12.3063 8.59375 12.1 8.3875 12.1H7.0125C6.77188 12.1 6.6 12.3063 6.6 12.5125V13.8875C6.6 14.1281 6.77188 14.3 7.0125 14.3H8.3875C8.59375 14.3 8.8 14.1281 8.8 13.8875ZM8.8 10.5875V9.21252C8.8 9.00627 8.59375 8.80002 8.3875 8.80002H7.0125C6.77188 8.80002 6.6 9.00627 6.6 9.21252V10.5875C6.6 10.8281 6.77188 11 7.0125 11H8.3875C8.59375 11 8.8 10.8281 8.8 10.5875ZM8.8 7.28752V5.91252C8.8 5.70627 8.59375 5.50002 8.3875 5.50002H7.0125C6.77188 5.50002 6.6 5.70627 6.6 5.91252V7.28752C6.6 7.52815 6.77188 7.70002 7.0125 7.70002H8.3875C8.59375 7.70002 8.8 7.52815 8.8 7.28752ZM14.3 10.5875V9.21252C14.3 9.00627 14.0938 8.80002 13.8875 8.80002H12.5125C12.2719 8.80002 12.1 9.00627 12.1 9.21252V10.5875C12.1 10.8281 12.2719 11 12.5125 11H13.8875C14.0938 11 14.3 10.8281 14.3 10.5875ZM14.3 7.28752V5.91252C14.3 5.70627 14.0938 5.50002 13.8875 5.50002H12.5125C12.2719 5.50002 12.1 5.70627 12.1 5.91252V7.28752C12.1 7.52815 12.2719 7.70002 12.5125 7.70002H13.8875C14.0938 7.70002 14.3 7.52815 14.3 7.28752ZM14.3 3.98752V2.61252C14.3 2.40627 14.0938 2.20002 13.8875 2.20002H12.5125C12.2719 2.20002 12.1 2.40627 12.1 2.61252V3.98752C12.1 4.22815 12.2719 4.40002 12.5125 4.40002H13.8875C14.0938 4.40002 14.3 4.22815 14.3 3.98752ZM19.8 13.8875V12.5125C19.8 12.3063 19.5938 12.1 19.3875 12.1H18.0125C17.7719 12.1 17.6 12.3063 17.6 12.5125V13.8875C17.6 14.1281 17.7719 14.3 18.0125 14.3H19.3875C19.5938 14.3 19.8 14.1281 19.8 13.8875ZM19.8 10.5875V9.21252C19.8 9.00627 19.5938 8.80002 19.3875 8.80002H18.0125C17.7719 8.80002 17.6 9.00627 17.6 9.21252V10.5875C17.6 10.8281 17.7719 11 18.0125 11H19.3875C19.5938 11 19.8 10.8281 19.8 10.5875Z"
                  fill="white"
                />
              </svg>
            </div>
            <div>
              <h3>Bacolod eGov Portal</h3>
              <small>Your gateway to city services</small>
            </div>
          </div>
          <p>
            The <strong>Bacolod eGov Portal</strong> connects citizens, government offices, and
            essential services through a single online platform—available on both web and mobile
            app. From <strong>permit applications</strong> and <strong>online payments</strong> to
            city news and tourism updates, Bacolod’s digital governance is now just a tap or click
            away.
          </p>
          <div className="chips" aria-label="Portal services">
            <span>
              <i aria-hidden="true">↪</i> Permit Applications
            </span>
            <span>
              <i aria-hidden="true">▰</i> Online Payments
            </span>
            <span>
              <i aria-hidden="true">▤</i> City News
            </span>
            <span>
              <i aria-hidden="true">◉</i> Tourism Updates
            </span>
          </div>
          <div className="portal-access">
            <Link to="/#">
              <i aria-hidden="true">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.5 4.75H4.96875C5.4375 1.96875 6.5 0 7.75 0C8.96875 0 10.0625 1.96875 10.5 4.75ZM4.75 7.75C4.75 7.0625 4.78125 6.40625 4.84375 5.75H10.625C10.6875 6.40625 10.7188 7.0625 10.7188 7.75C10.7188 8.46875 10.6875 9.125 10.625 9.75H4.84375C4.78125 9.125 4.75 8.46875 4.75 7.75ZM14.875 4.75H11.5C11.2188 3 10.7188 1.40625 9.9375 0.34375C12.1875 1 14 2.65625 14.875 4.75ZM5.53125 0.34375C4.75 1.40625 4.25 3 3.96875 4.75H0.59375C1.46875 2.65625 3.28125 1 5.53125 0.34375ZM15.2188 5.75C15.375 6.40625 15.4688 7.0625 15.4688 7.75C15.4688 8.46875 15.375 9.125 15.2188 9.75H11.625C11.6875 9.09375 11.75 8.4375 11.75 7.75C11.75 7.09375 11.6875 6.40625 11.625 5.75H15.2188ZM3.75 7.75C3.75 8.4375 3.78125 9.09375 3.84375 9.75H0.25C0.09375 9.125 0 8.46875 0 7.75C0 7.0625 0.09375 6.40625 0.25 5.75H3.84375C3.78125 6.40625 3.75 7.09375 3.75 7.75ZM4.96875 10.75H10.5C10.0625 13.5625 8.96875 15.5 7.75 15.5C6.5 15.5 5.4375 13.5625 4.96875 10.75ZM9.9375 15.1875C10.7188 14.125 11.25 12.5312 11.5 10.75H14.875C14 12.875 12.1875 14.5312 9.9375 15.1875ZM0.59375 10.75H3.96875C4.25 12.5312 4.75 14.125 5.53125 15.1875C3.28125 14.5312 1.46875 12.875 0.59375 10.75Z"
                    fill="#ED8612"
                  />
                </svg>
              </i>
              <span>
                <small>Access via</small>
                <b>Web Portal</b>
              </span>
            </Link>
            <Link to="https://play.google.com/store/apps/details?id=co.fortistech.bacolodgapp">
              <i className="play-icon" aria-hidden="true">
                ▶
              </i>
              <span>
                <small>Download the</small>
                <b>Mobile App</b>
              </span>
            </Link>
          </div>
        </div>
      </section>
      <section className="benefits-section">
        <Title
          title="Why Choose eGov?"
          description="Experience seamless digital governance at your fingertips"
        />
        <div className="benefit-grid page-width">
          {[
            ['☝', 'Enhanced Convenience'],
            ['⚡', 'Streamlined Processes'],
            ['◉', 'Expanded Accessibility'],
            ['♟', 'Real-Time Information'],
          ].map(([icon, title], index) => (
            <article key={title}>
              <i>{icon}</i>
              <small>0{index + 1}</small>
              <h3>{title}</h3>
              <p>
                Access city services with a user-friendly digital experience available whenever and
                wherever you need it.
              </p>
            </article>
          ))}
        </div>
      </section>
      <section className="mayor-section page-width">
        <div className="mayor-portrait">
          <img src={asset('mayor1.png')} alt="Mayor Greg Gasataya" />
        </div>
        <div className="mayor-copy">
          <span className="eyebrow">
            <i aria-hidden="true">★</i> City Leadership
          </span>
          <h2>Leadership that Drives Innovation</h2>
          <h4>Hon. Greg Gasataya · City Mayor</h4>
          <p className="mayor-intro">
            Meet Hon. Greg Gasataya, guiding Bacolod’s digital transformation toward a smarter,
            citizen-first future.
          </p>
          <hr />
          <p>
            Under the visionary leadership of Mayor Greg Gasataya, Bacolod City continues to
            modernize local governance. The launch of this digital platform is a milestone in making
            public services faster, more accessible, and more transparent.
          </p>
          <blockquote>
            <i aria-hidden="true">”</i>
            <em>
              “This initiative is not just about technology—it’s about empowering every Bacolodnon
              to connect, participate, and prosper in our growing digital community.”
            </em>
            <strong>— Mayor Greg Gasataya</strong>
          </blockquote>
        </div>
      </section>
      <section className="city-stats">
        <div className="page-width">
          {[
            ['CITIZENS', '624,787'],
            ['YEARS OF FOUNDATION', '87'],
            ['SQUARE KM OF CITY', '162.67'],
            ['BARANGAYS', '61'],
          ].map(([label, value]) => (
            <div key={label}>
              <small>{label}</small>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </section>
      <section className="discover-section">
        <div className="discover-card page-width">
          <div className="discover-copy">
            <span className="eyebrow">
              <i aria-hidden="true">●</i> Explore Bacolod
            </span>
            <h2>
              Discover Bacolod —<br />
              <em>The City of Smiles</em>
            </h2>
            <p>
              Explore the vibrant culture, heritage, and attractions that make Bacolod one of the
              Philippines’ most beloved destinations.
            </p>
            <p className="discover-detail">
              Bacolod City is more than just a bustling urban hub—it’s a cultural experience filled
              with warmth, color, and tradition. From its famous MassKara Festival to its rich
              culinary heritage and historic landmarks, Bacolod invites visitors to experience the
              perfect blend of hospitality and innovation.
            </p>
            <Link className="button" to="/tourism">
              Explore More <span aria-hidden="true">›</span>
            </Link>
          </div>
          <div className="discover-images">
            <figure className="discover-featured">
              <img src={asset('slider1.png')} alt="MassKara Festival dancers" />
              <span>Featured</span>
              <figcaption>
                <b>MassKara Festival</b>
                <small>
                  Celebrate smiles, music, and rich culture in the most colorful event in Bacolod.
                </small>
              </figcaption>
            </figure>
            <figure>
              <img src={asset('inasal.jpg')} alt="Bacolod chicken inasal" />
              <figcaption>
                <b>Local Flavors</b>
              </figcaption>
            </figure>
            <figure>
              <img src={asset('ruins.jpg')} alt="The Ruins heritage landmark" />
              <figcaption>
                <b>The Ruins</b>
              </figcaption>
            </figure>
          </div>
        </div>
        <div className="news-section page-width" id="news">
          <Title
            title="Latest News and Announcements"
            description="Stay informed with the most recent updates and initiatives from Bacolod City."
          />
          {!newsIsLive && (
            <p className="news-feed-notice" role="status">
              Live updates are temporarily unavailable. Showing sample announcements.
            </p>
          )}
          <div className="news-grid">
            {news.slice(0, 3).map((item, index) => (
              <article key={item.id}>
                <div className="news-image">
                  <img src={item.image || asset(`news${index + 1}.png`)} alt="" />
                  <span>{item.category}</span>
                </div>
                <div>
                  <small>{formatNewsDate(item.date)}</small>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                  {item.url ? (
                    <a href={item.url} target="_blank" rel="noreferrer">
                      Read →
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function ServicesPage() {
  return (
    <section className="content-page page-width">
      <Title
        title="Online Services"
        description="Access essential city services online—fast, secure, and convenient."
      />
      <div className="service-grid">
        {services.map((service) => (
          <Link to={service.href} key={service.id}>
            <i>{service.icon}</i>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <span>Open service →</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

const bploOptions = [
  [
    'New Business Permit',
    'Register and apply for a new business permit.',
    '/services/bplo/requirements',
  ],
  ['Renew Business Permit', 'Renew your existing permit online.', '/services/bplo/apply'],
  ['Retire Business', 'Submit a request to retire a business.', '/services/bplo/apply'],
  ['Request Certification', 'Request a certified business record.', '/services/bplo/apply'],
  ['Track Application', 'Check your application status.', '/services/bplo/apply'],
  ['Business Locator', 'Verify businesses registered in Bacolod.', '/local-business'],
]

function BploPage() {
  return (
    <section className="content-page page-width">
      <Title
        eyebrow="Business Permits & Licensing Office"
        title={
          <>
            What would you like
            <br />
            to do today?
          </>
        }
        description="Manage your business permits and registrations online."
      />
      <div className="bplo-grid">
        {bploOptions.map(([title, copy, href], index) => (
          <Link key={title} to={href}>
            <i>{['＋', '↻', '×', '▤', '◎', '⌖'][index]}</i>
            <h3>{title}</h3>
            <p>{copy}</p>
            <span>Continue →</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

function RequirementsPage() {
  const [checked, setChecked] = useState([false, false, false])
  return (
    <section className="content-page narrow">
      <Link className="back-link" to="/services/bplo">
        ← Back to BPLO Services
      </Link>
      <Title
        eyebrow="New Business Permit"
        title="Requirements and application"
        description="Prepare the following documents before starting your application."
      />
      <div className="requirements-layout">
        <div className="requirements-card">
          <h3>Required Documents</h3>
          {[
            'Unified Application Form for New Business Permit',
            'Articles of Incorporation / DTI Registration',
            'Barangay Business Clearance with official receipt',
          ].map((item, index) => (
            <label key={item}>
              <input
                type="checkbox"
                checked={checked[index]}
                onChange={() =>
                  setChecked((all) => all.map((value, i) => (i === index ? !value : value)))
                }
              />
              <span>
                <b>{item}</b>
                <small>PDF, JPG, or PNG · maximum 10 MB</small>
              </span>
            </label>
          ))}
          <div className="progress">
            <span style={{ width: `${(checked.filter(Boolean).length / 3) * 100}%` }} />
          </div>
          <p>{checked.filter(Boolean).length} of 3 requirements ready</p>
        </div>
        <aside>
          <h3>Apply for New Business Permit</h3>
          <p>Once your documents are ready, begin the secure online application.</p>
          <Link className="button" to="/services/bplo/apply">
            Start application →
          </Link>
          <hr />
          <h3>Need Help?</h3>
          <p>
            Call the BPLO help desk at <b>(034) 434-9122</b>.
          </p>
        </aside>
      </div>
    </section>
  )
}

function PermitApplication() {
  const [step, setStep] = useState(1)
  const [sent, setSent] = useState(false)
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (step < 3) setStep(step + 1)
    else setSent(true)
  }
  if (sent)
    return (
      <section className="content-page narrow">
        <div className="success-panel">
          <i>✓</i>
          <h2>Application received</h2>
          <p>
            Your reference is <b>BPLO-{Date.now().toString().slice(-7)}</b>.
          </p>
          <Link className="button" to="/services/bplo">
            Return to BPLO
          </Link>
        </div>
      </section>
    )
  return (
    <section className="content-page narrow">
      <Link className="back-link" to="/services/bplo/requirements">
        ← Back to requirements
      </Link>
      <Title
        eyebrow={`Step ${step} of 3`}
        title="Apply for a New Business Permit"
        description="Complete the required information below."
      />
      <div className="stepper">
        {['Applicant', 'Business', 'Review'].map((label, index) => (
          <span className={step >= index + 1 ? 'active' : ''} key={label}>
            <i>{index + 1}</i>
            {label}
          </span>
        ))}
      </div>
      <form className="form-card" onSubmit={handleSubmit}>
        {step === 1 && (
          <>
            <label>
              Applicant name
              <input required placeholder="Juan Dela Cruz" />
            </label>
            <label>
              Email address
              <input required type="email" placeholder="juan@example.com" />
            </label>
            <label>
              Mobile number
              <input required placeholder="09XX XXX XXXX" />
            </label>
          </>
        )}
        {step === 2 && (
          <>
            <label>
              Business name
              <input required placeholder="Registered business name" />
            </label>
            <label>
              Business type
              <select>
                <option>Sole Proprietorship</option>
                <option>Partnership</option>
                <option>Corporation</option>
              </select>
            </label>
            <label>
              Business address
              <textarea required rows={3} />
            </label>
          </>
        )}
        {step === 3 && (
          <div className="review-box">
            <h3>Review your application</h3>
            <p>
              By submitting this application, you confirm the information provided is complete and
              accurate.
            </p>
            <label className="check-line">
              <input required type="checkbox" /> I certify that the information is correct.
            </label>
          </div>
        )}
        <div className="form-actions">
          {step > 1 && (
            <button type="button" className="button button-muted" onClick={() => setStep(step - 1)}>
              Back
            </button>
          )}
          <button className="button">{step === 3 ? 'Submit application' : 'Continue'}</button>
        </div>
      </form>
    </section>
  )
}

function TourismPage() {
  const destinations = [
    ['destination1.png', 'Mambukal Resort', 'Nature'],
    ['destination2.png', 'Campuestohan Highland Resort', 'Adventure'],
    ['destination3.jpg', 'Lakawon Island', 'Beach'],
    ['destination4.jpg', 'Punta Taytay', 'Sunset'],
    ['destination5.png', 'MassKara Festival', 'Festival'],
    ['destination6.png', 'Negros Museum', 'Heritage'],
    ['destination7.jpg', 'The Ruins', 'Landmark'],
  ]
  return (
    <div className="tourism-page">
      <section className="tourism-hero">
        <div>
          <h1>
            Empowering Bacolod
            <br />
            Through Digital Governance
          </h1>
          <p>
            Explore culture, heritage, food, and unforgettable experiences in the City of Smiles.
          </p>
          <div>
            <a className="button button-light" href="#destinations">
              Explore Destinations
            </a>
            <a className="button" href="#dining">
              Discover Bacolod
            </a>
          </div>
          <figure>
            {['tourism1.png', 'tourism2.png', 'tourism3.png'].map((item) => (
              <img src={asset(item)} key={item} />
            ))}
          </figure>
        </div>
      </section>
      <section id="destinations" className="tour-section page-width">
        <Title
          eyebrow="Tourist Spots"
          title={
            <>
              Explore Bacolod’s <em>Top Destinations</em>
            </>
          }
          description="From heritage landmarks to natural escapes—discover what makes Bacolod truly unforgettable."
        />
        <div className="destination-grid">
          {destinations.map(([image, title, type]) => (
            <article key={title}>
              <img src={asset(image)} />
              <div>
                <span>{type}</span>
                <h3>{title}</h3>
              </div>
            </article>
          ))}
        </div>
        <button className="button">View all destinations →</button>
      </section>
      <section id="dining" className="dining-section page-width">
        <Title
          title="Dining in Bacolod"
          description="Taste iconic chicken inasal, local comfort food, and celebrated desserts."
        />
        <div className="restaurant-grid">
          {businesses.slice(0, 5).map(([name, type]) => (
            <article key={name}>
              <img src={asset('dining.png')} />
              <div>
                <span>★★★★★</span>
                <h3>{name}</h3>
                <p>{type}</p>
                <small>Open today · Bacolod City</small>
              </div>
            </article>
          ))}
        </div>
      </section>
      <Events />
    </div>
  )
}

const calendarEvents = [
  { day: 1, date: 22, start: 8, duration: 1, title: 'MassKara Festival 2025', tone: 'blue' },
  {
    day: 3,
    date: 24,
    start: 10.5,
    duration: 1,
    time: '11:00 - 12:00',
    title: 'Bacolod Food & Flavors Expo',
    tone: 'blue',
  },
  {
    day: 5,
    date: 26,
    start: 13.5,
    duration: 1,
    time: '2:00 - 3:00',
    title: 'Sunset Beats by the Bay',
    tone: 'orange',
  },
  {
    day: 2,
    date: 23,
    start: 15.5,
    duration: 1,
    time: '4:00 - 5:00',
    title: 'Panaad sa Negros Festival',
    tone: 'pink',
  },
  {
    day: 5,
    date: 26,
    start: 15.5,
    duration: 1,
    time: '4:00 - 5:00',
    title: 'Sounds of the City: Bacolod',
    tone: 'pink',
  },
]

function Events() {
  const [calendarDate, setCalendarDate] = useState(() => new Date(2025, 8, 21))
  const [view, setView] = useState('Week')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const isSameDate = (date: Date) =>
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  const weekStart = new Date(calendarDate)
  weekStart.setDate(calendarDate.getDate() - calendarDate.getDay())
  weekStart.setHours(0, 0, 0, 0)
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart)
    date.setDate(weekStart.getDate() + index)
    return date
  })
  const dayDate = new Date(calendarDate)
  const monthDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1)
  const year = calendarDate.getFullYear()
  const range =
    view === 'Day'
      ? dayDate.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : view === 'Month'
        ? monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : view === 'Year'
          ? String(year)
          : `${days[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${days[6].toLocaleDateString('en-US', { day: 'numeric', year: 'numeric' })}`
  const hours = Array.from({ length: 9 }, (_, row) => row + 8)
  const selectView = (option: string) => setView(option)
  const moveCalendar = (direction: number) =>
    setCalendarDate((current) => {
      const next = new Date(current)
      if (view === 'Day') next.setDate(next.getDate() + direction)
      if (view === 'Week') next.setDate(next.getDate() + direction * 7)
      if (view === 'Month') next.setMonth(next.getMonth() + direction)
      if (view === 'Year') next.setFullYear(next.getFullYear() + direction)
      return next
    })
  const goToday = () => setCalendarDate(new Date(today))
  const monthLeading = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1).getDay()
  const monthDays = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate()
  const monthCells = Array.from({ length: 42 }, (_, index) => index - monthLeading + 1)
  const isEventMonth = calendarDate.getFullYear() === 2025 && calendarDate.getMonth() === 8
  const dayEvents = isEventMonth
    ? calendarEvents.filter((event) => event.date === calendarDate.getDate())
    : []
  const isEventWeek =
    weekStart.getFullYear() === 2025 && weekStart.getMonth() === 8 && weekStart.getDate() === 21
  return (
    <section className="events-section page-width">
      <Title
        title="Upcoming Events"
        description="Stay updated with the latest happenings and activities around Bacolod."
      />
      <div className="weekly-calendar">
        <div className="week-toolbar">
          <div className="week-navigation">
            <button aria-label={`Previous ${view.toLowerCase()}`} onClick={() => moveCalendar(-1)}>
              ‹
            </button>
            <button className="today-button" onClick={goToday}>
              Today
            </button>
            <button aria-label={`Next ${view.toLowerCase()}`} onClick={() => moveCalendar(1)}>
              ›
            </button>
          </div>
          <div className="calendar-views" aria-label="Calendar view">
            {['Day', 'Week', 'Month', 'Year'].map((option) => (
              <button
                key={option}
                className={view === option ? 'active' : ''}
                onClick={() => selectView(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <b>{range}</b>
        </div>
        {view === 'Week' && (
          <div className="week-scroll">
            <div className="week-grid">
              <div className="week-corner" />
              {days.map((day) => (
                <div
                  className={`week-day ${isSameDate(day) ? 'is-today' : ''}`}
                  key={day.toISOString()}
                >
                  <small>
                    {day.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
                  </small>
                  <strong>{day.getDate()}</strong>
                </div>
              ))}
              {hours.map((hour, row) => (
                <div className="week-row" style={{ gridRow: `${row * 2 + 2} / span 2` }} key={hour}>
                  <span>
                    {hour > 12 ? hour - 12 : hour}
                    {hour >= 12 ? 'pm' : 'am'}
                  </span>
                </div>
              ))}
              {isEventWeek &&
                calendarEvents.map((event) => (
                  <div
                    key={`${event.day}-${event.title}`}
                    className={`week-event ${event.tone}`}
                    style={{
                      gridColumn: event.day + 2,
                      gridRow: `${Math.round((event.start - 8) * 2) + 2} / span ${event.duration * 2}`,
                    }}
                  >
                    {event.time && <small>{event.time}</small>}
                    <b>{event.title}</b>
                  </div>
                ))}
            </div>
          </div>
        )}
        {view === 'Day' && (
          <div className={`day-view ${isSameDate(dayDate) ? 'is-today' : ''}`}>
            {hours.map((hour) => (
              <div className="day-hour" key={hour}>
                <span>
                  {hour > 12 ? hour - 12 : hour}
                  {hour >= 12 ? 'pm' : 'am'}
                </span>
                <div>
                  {dayEvents
                    .filter((event) => Math.floor(event.start) === hour)
                    .map((event) => (
                      <article className={`calendar-list-event ${event.tone}`} key={event.title}>
                        <small>{event.time || `${hour}:00`}</small>
                        <b>{event.title}</b>
                      </article>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {view === 'Month' && (
          <div className="month-view">
            <div className="month-weekdays">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <b key={day}>{day}</b>
              ))}
            </div>
            <div className="month-grid-view">
              {monthCells.map((date, index) => {
                const cellDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), date)
                return (
                  <div
                    className={`${date < 1 || date > monthDays ? 'outside ' : ''}${date > 0 && date <= monthDays && isSameDate(cellDate) ? 'is-today' : ''}`}
                    key={index}
                  >
                    <span>{date > 0 && date <= monthDays ? date : ''}</span>
                    {isEventMonth &&
                      calendarEvents
                        .filter((event) => event.date === date)
                        .slice(0, 2)
                        .map((event) => (
                          <small className={event.tone} key={event.title}>
                            {event.title}
                          </small>
                        ))}
                  </div>
                )
              })}
            </div>
          </div>
        )}
        {view === 'Year' && (
          <div className="year-view">
            {Array.from({ length: 12 }, (_, month) => (
              <div className="mini-month" key={month}>
                <b>{new Date(year, month, 1).toLocaleDateString('en-US', { month: 'long' })}</b>
                <div>
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                    <small key={`${day}-${index}`}>{day}</small>
                  ))}
                  {Array.from({ length: new Date(year, month, 1).getDay() }, (_, index) => (
                    <i key={`blank-${index}`} />
                  ))}
                  {Array.from({ length: new Date(year, month + 1, 0).getDate() }, (_, index) => {
                    const date = index + 1
                    const isToday =
                      year === today.getFullYear() &&
                      month === today.getMonth() &&
                      date === today.getDate()
                    const hasEvent =
                      year === 2025 &&
                      month === 8 &&
                      calendarEvents.some((event) => event.date === date)
                    return (
                      <span
                        className={`${hasEvent ? 'has-event ' : ''}${isToday ? 'is-today' : ''}`}
                        key={index}
                      >
                        {date}
                      </span>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function RequestModal({ type, onClose }: { type: string; onClose: () => void }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [reference, setReference] = useState('')
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('loading')
    const form = new FormData(event.currentTarget)
    try {
      const result = await submitRequest({
        service: type,
        name: String(form.get('name')),
        email: String(form.get('email')),
        details: String(form.get('details')),
      })
      setReference(result.reference)
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }
  return (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      onMouseDown={(event) => event.currentTarget === event.target && onClose()}
    >
      <div className="modal-card">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        {status === 'done' ? (
          <div className="success-panel compact">
            <i>✓</i>
            <h2>Request received</h2>
            <p>
              Reference: <b>{reference}</b>
            </p>
            {!firebaseReady && (
              <small>Demo mode is active until Firebase credentials are added.</small>
            )}
            <button className="button" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <>
            <span className="eyebrow">{type}</span>
            <h2>Send your request</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Full name
                <input name="name" required />
              </label>
              <label>
                Email address
                <input name="email" type="email" required />
              </label>
              <label>
                Details
                <textarea name="details" rows={4} required />
              </label>
              {status === 'error' && <p className="error">Submission failed. Please try again.</p>}
              <button className="button" disabled={status === 'loading'}>
                {status === 'loading' ? 'Submitting…' : 'Submit request'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

function WastePage() {
  const [modal, setModal] = useState<string | null>(null)
  return (
    <div className="waste-page">
      <section className="content-page page-width">
        <Title
          title="Bacolod City Waste Management"
          description="Show next waste collection schedule for multiple barangays."
        />
        <div className="search-panel">
          <input placeholder="Enter barangay, e.g. Tanza" />
          <button className="button">Search</button>
        </div>
        <div className="action-row">
          <button className="button" onClick={() => setModal('Schedule Pickup')}>
            Schedule Pickup
          </button>
          <button className="button" onClick={() => setModal('Report Waste Issue')}>
            Report Issue
          </button>
          <button className="button">Waste Disposal Guide</button>
        </div>
        <div className="schedule-cards">
          {[
            ['Nov 4 Wednesday, 8:00 AM', 'Barangay 1'],
            ['Nov 6 Friday, 9:00 AM', 'Barangay 2'],
            ['Nov 6 Friday, 10:00 AM', 'Barangay 3'],
          ].map(([time, place]) => (
            <article key={place}>
              <i>⚑</i>
              <b>{time}</b>
              <small>{place}</small>
            </article>
          ))}
        </div>
        <Events />
      </section>
      <section className="waste-banner">
        Never miss a pickup again! Set your reminders for
        <br />
        your barangay’s collection schedule.
      </section>
      <section className="disposal-guide page-width">
        <Title
          title={
            <>
              Know how to dispose of your waste properly — let’s keep{' '}
              <em>Bacolod City clean and green!</em>
            </>
          }
        />
        <div className="waste-tabs">
          <button>♻ Recyclables</button>
          <button>Biodegradable</button>
          <button>Residual Waste</button>
          <button>Special Waste</button>
        </div>
        <div className="tip-grid">
          {[
            ['step1.jpg', 'Rinse containers before placing them in bins.'],
            ['step2.jpg', 'Flatten cardboard boxes to save space.'],
            ['step3.png', 'Separate glass items by color if possible.'],
          ].map(([image, copy], index) => (
            <article key={copy}>
              <img src={asset(image)} />
              <span>0{index + 1}</span>
              <b>{copy}</b>
            </article>
          ))}
        </div>
      </section>
      {modal && <RequestModal type={modal} onClose={() => setModal(null)} />}
    </div>
  )
}

function JobsPage() {
  const [query, setQuery] = useState('')
  const shown = useMemo(
    () => jobs.filter((job) => job.join(' ').toLowerCase().includes(query.toLowerCase())),
    [query],
  )
  return (
    <section className="content-page page-width">
      <Title
        eyebrow="Careers"
        title="Job Opportunities"
        description="Find meaningful work and serve the people of Bacolod."
      />
      <div className="listing-search">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search job title or office"
        />
        <button className="button">Search Jobs</button>
      </div>
      <div className="filter-pills">
        <button>All Jobs</button>
        <button>Administrative</button>
        <button>Engineering</button>
        <button>Technology</button>
        <button>Healthcare</button>
      </div>
      <div className="job-list">
        {shown.map(([title, office, salary, type]) => (
          <article key={title}>
            <div className="job-icon">▣</div>
            <div>
              <span>{type}</span>
              <h3>{title}</h3>
              <p>{office}</p>
              <small>⌖ Bacolod City · {salary}</small>
            </div>
            <Link className="button button-outline" to="/services">
              Apply Now
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}

function BidsPage({ procurement = false }: { procurement?: boolean }) {
  const [query, setQuery] = useState('')
  const shown = bidItems.filter((item) =>
    item.join(' ').toLowerCase().includes(query.toLowerCase()),
  )
  return (
    <section className="content-page page-width">
      <div className="bid-layout">
        <aside>
          <h3>Bids & Procurement</h3>
          <NavLink to="/bids">All Bids</NavLink>
          <NavLink to="/procurement">Annual Procurement Plan</NavLink>
          <a href="#awards">Notice of Awards</a>
          <a href="#archive">Archive</a>
        </aside>
        <div>
          <Title
            title={procurement ? 'Annual Procurement Plan' : 'All Bids'}
            description={
              procurement
                ? 'Download approved annual procurement plans.'
                : 'Browse active procurement opportunities from Bacolod City.'
            }
          />
          <div className="listing-search">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search bids"
            />
            <button className="button">Search</button>
          </div>
          <div className="bid-table">
            {shown.slice(0, procurement ? 2 : 4).map(([title, ref, category, date]) => (
              <article key={ref}>
                <img src={asset('pdfImg.png')} />
                <div>
                  <span>{category}</span>
                  <h3>{procurement ? `${title} — Annual Plan` : title}</h3>
                  <p>
                    {ref} · Closing {date}
                  </p>
                </div>
                <button className="button button-outline">Download PDF</button>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function BusinessPage() {
  const [query, setQuery] = useState('')
  const shown = businesses.filter((item) =>
    item.join(' ').toLowerCase().includes(query.toLowerCase()),
  )
  return (
    <section className="content-page page-width">
      <Title
        eyebrow="Support Local"
        title="Discover Local Businesses"
        description="Explore Bacolod restaurants, cafés, shops, and services."
      />
      <div className="listing-search">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search restaurants, cafes…"
        />
        <select>
          <option>All Categories</option>
          <option>Restaurants</option>
          <option>Cafés</option>
        </select>
        <button className="button">Search</button>
      </div>
      <div className="business-grid">
        {shown.map(([name, type, image]) => (
          <Link to="/local-business/21-restaurant" key={name}>
            <img src={asset(image)} />
            <div>
              <span>★★★★★</span>
              <h3>{name}</h3>
              <p>{type}</p>
              <small>⌖ Bacolod City</small>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

function BusinessDetail() {
  const [feedback, setFeedback] = useState(false)
  return (
    <div>
      <section
        className="business-hero"
        style={{
          backgroundImage: `linear-gradient(#1112,#111b),url(${asset('businessDetail.jpg')})`,
        }}
      >
        <Link to="/local-business">← Back to directory</Link>
        <div>
          <span>Filipino · Fine Dining</span>
          <h1>21 Restaurant</h1>
          <p>Authentic Negrense flavors and warm Bacolod hospitality.</p>
        </div>
      </section>
      <section className="content-page page-width">
        <div className="business-summary">
          <div>
            <Title
              title="A Bacolod dining institution"
              description="A beloved destination for classic Filipino dishes, seafood specialties, and the city’s signature hospitality."
            />
            <div className="filter-pills">
              <button>Overview</button>
              <button>Menu</button>
              <button>Photos</button>
              <button>Reviews</button>
            </div>
          </div>
          <aside>
            <b>Open today</b>
            <p>11:00 AM – 10:00 PM</p>
            <p>21st Street, Bacolod City</p>
            <p>(034) 434-4091</p>
            <button className="button" onClick={() => setFeedback(true)}>
              Leave feedback
            </button>
          </aside>
        </div>
        <Title title="Popular dishes" />
        <div className="business-grid dishes">
          {businesses.slice(0, 3).map(([name, type]) => (
            <article key={name}>
              <img src={asset('dining.png')} />
              <div>
                <h3>{name}</h3>
                <p>{type}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      {feedback && <RequestModal type="Business Feedback" onClose={() => setFeedback(false)} />}
    </div>
  )
}

function CivicPage() {
  const navigate = useNavigate()
  return (
    <div className="civic-page">
      <section className="civic-hero">
        <div>
          <span>Citizen Participation</span>
          <h1>
            Your Voice Shapes
            <br />
            Bacolod’s Future
          </h1>
          <p>Join consultations, answer surveys, and take part in building a better city.</p>
          <div>
            <button className="button" onClick={() => navigate('/services')}>
              Take a Survey
            </button>
            <a className="button button-light" href="#consultations">
              View Consultations
            </a>
          </div>
        </div>
      </section>
      <section id="consultations" className="content-page page-width">
        <Title
          eyebrow="Get Involved"
          title="Civic Engagement Tools"
          description="Simple ways to share your voice and participate in local government."
        />
        <div className="civic-grid">
          {[
            ['◫', 'Public Surveys', 'Give feedback on programs, services, and city priorities.'],
            ['◎', 'Consultations', 'Review proposals and join active public discussions.'],
            ['⚑', 'Report an Issue', 'Tell the city about concerns in your barangay.'],
          ].map(([icon, title, copy]) => (
            <article key={title}>
              <i>{icon}</i>
              <span>Open</span>
              <h3>{title}</h3>
              <p>{copy}</p>
              <Link className="button button-outline" to="/services">
                Participate
              </Link>
            </article>
          ))}
        </div>
        <Title
          title="How to Participate"
          description="Your contribution only takes a few minutes."
        />
        <div className="participate-grid">
          {[
            ['step1.jpg', 'Choose a topic'],
            ['step2.jpg', 'Share your feedback'],
            ['step3.png', 'Track city action'],
          ].map(([image, title], index) => (
            <article key={title}>
              <img src={asset(image)} />
              <span>0{index + 1}</span>
              <h3>{title}</h3>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

function NotFound() {
  return (
    <section className="content-page page-width">
      <div className="success-panel">
        <i>404</i>
        <h2>Page not found</h2>
        <Link className="button" to="/">
          Return home
        </Link>
      </div>
    </section>
  )
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/bplo" element={<BploPage />} />
        <Route path="/services/bplo/requirements" element={<RequirementsPage />} />
        <Route path="/services/bplo/apply" element={<PermitApplication />} />
        <Route path="/tourism" element={<TourismPage />} />
        <Route path="/waste" element={<WastePage />} />
        <Route path="/wasteManagement" element={<WastePage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobListing" element={<JobsPage />} />
        <Route path="/bids" element={<BidsPage />} />
        <Route path="/allBids" element={<BidsPage />} />
        <Route path="/procurement" element={<BidsPage procurement />} />
        <Route path="/local-business" element={<BusinessPage />} />
        <Route path="/localBusiness" element={<BusinessPage />} />
        <Route path="/local-business/21-restaurant" element={<BusinessDetail />} />
        <Route path="/civic" element={<CivicPage />} />
        <Route path="/civicEngagement" element={<CivicPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}
