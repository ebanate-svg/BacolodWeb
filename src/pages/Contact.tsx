import { Clock3, Mail, MapPin, Phone, Sparkles } from 'lucide-react'
import GetAppPanel from '../components/GetAppPanel'

function ContactPage() {
  return (
    <div className="contact-page min-h-screen bg-orange-50/30 font-sans text-brand-ink">
      <section className="contact-hero text-center">
        <div className="page-width">
          <span className="contact-kicker inline-flex items-center justify-center">
            <Sparkles aria-hidden="true" /> Connect with the City of Smiles
          </span>
          <h1>How Can We Help?</h1>
          <p>
            Connect with the right Bacolod City office. Send requests through the Bacolod G App.
          </p>
          <div className="contact-highlights" aria-label="Contact service highlights">
            <span>
              <Clock3 aria-hidden="true" /> Monday–Friday
            </span>
            <span>
              <Phone aria-hidden="true" /> City assistance
            </span>
            <span>
              <MapPin aria-hidden="true" /> Bacolod City Hall
            </span>
          </div>
        </div>
      </section>

      <section className="contact-content page-width">
        <div className="contact-intro">
          <div>
            <span className="eyebrow">Contact Bacolod City</span>
            <h2>Reach the city</h2>
            <p>Call, email, or visit the city office. For requests, use the Bacolod G App.</p>
          </div>
          <a className="button button-outline" href="tel:+63344349122">
            Call (034) 434-9122
          </a>
        </div>

        <div className="contact-layout grid items-start">
          <aside className="contact-information">
            <div className="contact-location-visual">
              <span aria-hidden="true">
                <MapPin />
              </span>
              <div>
                <small>Visit city hall</small>
                <strong>Bacolod City Government Center</strong>
              </div>
            </div>
            <div className="contact-details">
              <div>
                <i aria-hidden="true">
                  <MapPin />
                </i>
                <span>
                  <b>Office address</b>
                  <p>Brgy. Villamonte, Bacolod City, Negros Occidental</p>
                </span>
              </div>
              <div>
                <i aria-hidden="true">
                  <Phone />
                </i>
                <span>
                  <b>Telephone</b>
                  <a href="tel:+63344349122">(034) 434-9122</a>
                </span>
              </div>
              <div>
                <i aria-hidden="true">
                  <Mail />
                </i>
                <span>
                  <b>Email</b>
                  <a href="mailto:info@bacolodcity.gov.ph">info@bacolodcity.gov.ph</a>
                </span>
              </div>
              <div>
                <i aria-hidden="true">
                  <Clock3 />
                </i>
                <span>
                  <b>Office hours</b>
                  <p>Monday–Friday, 8:00 AM–5:00 PM</p>
                </span>
              </div>
            </div>
            <div className="contact-emergency-note">
              <b>Need urgent assistance?</b>
              <p>For emergencies, contact the appropriate emergency service directly.</p>
            </div>
          </aside>

          <GetAppPanel
            title="Send your request in the app"
            copy="Use the Bacolod G App to send requests and feedback to the city."
          />
        </div>
      </section>
    </div>
  )
}

export default ContactPage
