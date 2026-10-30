import { Camera, Globe2, Network } from 'lucide-react'
import { Link } from 'react-router-dom'
import { asset } from '../utils/assets'
import AppDownloadBadges from './AppDownloadBadges'

function Footer() {
  return (
    <>
      <section className="future-section text-center text-white">
        <h2 className="font-heading font-extrabold">
          Be Part of Bacolod’s
          <br />
          Digital Future
        </h2>
        <p className="mx-auto">
          Join thousands of citizens embracing a smarter,
          <br />
          more connected city.
          <br />
          Download the app
        </p>
        <AppDownloadBadges className="future-downloads" />
      </section>
      <footer className="font-sans" id="contact">
        <div className="footer-grid page-width grid">
          <img className="object-contain" src={asset('bacolodLogo.png')} alt="Bacolod City" />
          <div className="flex flex-col">
            <h3>Services</h3>
            <Link to="/services">Local Government Service</Link>
            <Link to="/civic">Community Notices & Events</Link>
            <Link to="/waste">Waste Management</Link>
            <Link to="/jobs">Local Business & Job Listings</Link>
          </div>
          <div className="flex flex-col">
            <h3>Explore</h3>
            <Link to="/tourism">Local Tourism & Recreation</Link>
            <Link to="/bids">Public Bids & Procurement</Link>
            <Link to="/civic">Civic Engagement</Link>
          </div>
          <div className="flex flex-col">
            <h3>Legal</h3>
            <Link to="/contact">Contact the City</Link>
            <a href="#terms">Terms and Conditions</a>
            <a href="#privacy">Privacy Policy</a>
          </div>
        </div>
        <div className="footer-bottom page-width flex items-center justify-between">
          <span>
            © 2026 – City Government of Bacolod
            <br />
            <small>ALL RIGHTS RESERVED</small>
          </span>
          <span className="footer-socials flex items-center" aria-label="Bacolod City social media">
            <a href="#facebook" aria-label="Facebook">
              <Globe2 aria-hidden="true" />
            </a>
            <a href="#instagram" aria-label="Instagram">
              <Camera aria-hidden="true" />
            </a>
            <a href="#linkedin" aria-label="LinkedIn">
              <Network aria-hidden="true" />
            </a>
          </span>
        </div>
      </footer>
    </>
  )
}

export default Footer
