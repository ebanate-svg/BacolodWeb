import { Clock3, Headset, Mail, MapPin, Phone, Siren, Sparkles } from 'lucide-react'
import GetAppPanel from '../components/GetAppPanel'
import { phoneLines } from '../data'

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
            <p>
              Call the right line below, email, or visit City Hall. For requests, use the Bacolod G
              App.
            </p>
          </div>
        </div>

        <div className="call-options" aria-label="Phone numbers">
          <a className="call-option" href={`tel:${phoneLines.cityHall.tel}`}>
            <Phone aria-hidden="true" />
            <span>
              <b>City Hall</b>
              <small>Offices and general questions · Monday–Friday, 8:00 AM–5:00 PM</small>
              <strong>{phoneLines.cityHall.display}</strong>
            </span>
          </a>
          <a className="call-option" href={`tel:${phoneLines.hotline.tel}`}>
            <Headset aria-hidden="true" />
            <span>
              <b>BCD 6100 Hotline</b>
              <small>
                Non-emergency city concerns: garbage, traffic, roads, permits, assistance · English
                and Hiligaynon
              </small>
              <strong>{phoneLines.hotline.display}</strong>
            </span>
          </a>
          <a className="call-option call-option-emergency" href={`tel:${phoneLines.emergency.tel}`}>
            <Siren aria-hidden="true" />
            <span>
              <b>Emergency</b>
              <small>Police, fire, or medical emergency</small>
              <strong>{phoneLines.emergency.display}</strong>
            </span>
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
