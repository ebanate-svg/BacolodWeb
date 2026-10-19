import { Link } from 'react-router-dom'
import { asset } from '../utils/assets'
import AppDownloadBadges from './AppDownloadBadges'

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

export default Footer
