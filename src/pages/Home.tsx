import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AppDownloadBadges from '../components/AppDownloadBadges'
import DeferredSection from '../components/DeferredSection'
import Title from '../components/Title'
import { news as fallbackNews, type NewsItem } from '../data'
import { loadLatestNews } from '../firebase'
import { asset, formatNewsDate } from '../utils/assets'

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
          <span className="hero-kicker">✦ Bacolod City Digital Services</span>
          <h1>
            Empowering Bacolod
            <br />
            Through Digital Governance
          </h1>
          <p>
            Access essential city services and updates from your computer or mobile device—anytime,
            anywhere.
          </p>
          <div className="hero-meta" aria-label="Portal highlights">
            <span>◷ 24/7 Access</span>
            <span>⌖ Bacolod City</span>
            <span>♡ Citizen First</span>
          </div>
          <div className="hero-actions">
            <Link className="button" to="/services">
              Explore Services
            </Link>
            <Link className="button button-outline" to="/tourism">
              Discover Bacolod
            </Link>
          </div>
        </div>
        <img src={asset('slider2.png')} alt="Bacolod community" />
      </section>
      <AppDownloadBadges />
      <DeferredSection className="portal-section page-width" minHeight={360}>
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
      </DeferredSection>
      <DeferredSection className="benefits-section" minHeight={300}>
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
      </DeferredSection>
      <DeferredSection className="mayor-section page-width" minHeight={440}>
        <div className="mayor-portrait">
          <img src={asset('mayor1.png')} alt="Mayor Greg Gasataya" loading="lazy" />
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
      </DeferredSection>
      <DeferredSection className="city-stats" minHeight={180}>
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
      </DeferredSection>
      <DeferredSection className="discover-section" minHeight={850}>
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
              <img src={asset('slider1.png')} alt="MassKara Festival dancers" loading="lazy" />
              <span>Featured</span>
              <figcaption>
                <b>MassKara Festival</b>
                <small>
                  Celebrate smiles, music, and rich culture in the most colorful event in Bacolod.
                </small>
              </figcaption>
            </figure>
            <figure>
              <img src={asset('inasal.jpg')} alt="Bacolod chicken inasal" loading="lazy" />
              <figcaption>
                <b>Local Flavors</b>
              </figcaption>
            </figure>
            <figure>
              <img src={asset('ruins.jpg')} alt="The Ruins heritage landmark" loading="lazy" />
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
                  <img src={item.image || asset(`news${index + 1}.png`)} alt="" loading="lazy" />
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
      </DeferredSection>
    </div>
  )
}

export default Home
