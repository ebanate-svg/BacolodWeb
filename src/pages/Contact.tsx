import { useState, type FormEvent } from 'react'

function ContactPage() {
  const [sent, setSent] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSent(true)
  }

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="page-width">
          <span className="contact-kicker">✦ Connect with the City of Smiles</span>
          <h1>How Can We Help?</h1>
          <p>Send a question, request assistance, or connect with the right Bacolod City office.</p>
          <div className="contact-highlights" aria-label="Contact service highlights">
            <span>◷ Monday–Friday</span>
            <span>☎ City assistance</span>
            <span>⌖ Bacolod City Hall</span>
          </div>
        </div>
      </section>

      <section className="contact-content page-width">
        <div className="contact-intro">
          <div>
            <span className="eyebrow">Contact Bacolod City</span>
            <h2>Send us a message</h2>
            <p>Complete the form and select the service that best matches your concern.</p>
          </div>
          <a className="button button-outline" href="tel:+63344349122">
            Call (034) 434-9122
          </a>
        </div>

        <div className="contact-layout">
          <aside className="contact-information">
            <div className="contact-location-visual">
              <span>⌖</span>
              <div>
                <small>Visit city hall</small>
                <strong>Bacolod City Government Center</strong>
              </div>
            </div>
            <div className="contact-details">
              <div>
                <i aria-hidden="true">⌖</i>
                <span>
                  <b>Office address</b>
                  <p>Brgy. Villamonte, Bacolod City, Negros Occidental</p>
                </span>
              </div>
              <div>
                <i aria-hidden="true">☎</i>
                <span>
                  <b>Telephone</b>
                  <a href="tel:+63344349122">(034) 434-9122</a>
                </span>
              </div>
              <div>
                <i aria-hidden="true">✉</i>
                <span>
                  <b>Email</b>
                  <a href="mailto:info@bacolodcity.gov.ph">info@bacolodcity.gov.ph</a>
                </span>
              </div>
              <div>
                <i aria-hidden="true">◷</i>
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

          <div className="contact-form-panel">
            {sent ? (
              <div className="contact-success" role="status">
                <i aria-hidden="true">✓</i>
                <span className="eyebrow">Message received</span>
                <h2>Thank you for contacting us</h2>
                <p>Your message has been recorded. A city representative will follow up soon.</p>
                <button className="button" type="button" onClick={() => setSent(false)}>
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="contact-form-heading">
                  <span className="eyebrow">Online inquiry</span>
                  <h2>Tell us what you need</h2>
                  <p>Fields marked with an asterisk are required.</p>
                </div>
                <div className="contact-fields">
                  <label>
                    <span>First name *</span>
                    <input required autoComplete="given-name" placeholder="First name" />
                  </label>
                  <label>
                    <span>Last name *</span>
                    <input required autoComplete="family-name" placeholder="Last name" />
                  </label>
                  <label>
                    <span>Phone number</span>
                    <input type="tel" autoComplete="tel" placeholder="09XX XXX XXXX" />
                  </label>
                  <label>
                    <span>Email address *</span>
                    <input
                      required
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                    />
                  </label>
                  <label className="contact-field-wide">
                    <span>Service or office *</span>
                    <select required defaultValue="">
                      <option value="" disabled>
                        Select a service
                      </option>
                      <option>General City Inquiry</option>
                      <option>Online Services</option>
                      <option>Business Permits and Licensing</option>
                      <option>Waste Management</option>
                      <option>Tourism</option>
                      <option>Jobs and Employment</option>
                      <option>Bids and Procurement</option>
                    </select>
                  </label>
                  <label className="contact-field-wide">
                    <span>Message *</span>
                    <textarea required rows={5} placeholder="Describe your question or request" />
                  </label>
                </div>
                <label className="contact-consent">
                  <input required type="checkbox" />
                  <span>
                    I agree that the City Government of Bacolod may use this information to respond
                    to my inquiry.
                  </span>
                </label>
                <button className="button contact-submit" type="submit">
                  Send message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactPage
