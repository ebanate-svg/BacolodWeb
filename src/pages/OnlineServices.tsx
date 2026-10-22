import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import Title from '../components/Title'
import { services } from '../data'
import { asset } from '../utils/assets'

function ServicesPage() {
  return (
    <div className="services-page">
      <section className="services-hero">
        <div className="page-width">
          <span className="services-kicker">✦ Bacolod City Online Services</span>
          <h1>City Services, One Easy Platform</h1>
          <p>
            Apply, request, and access essential government services from wherever you are—securely
            and conveniently.
          </p>
          <div className="services-highlights" aria-label="Online service highlights">
            <span>◷ Available 24/7</span>
            <span>✓ Secure transactions</span>
            <span>⌖ Built for Bacolodnons</span>
          </div>
        </div>
      </section>
      <section className="services-catalog page-width">
        <Title
          eyebrow="Digital service center"
          title="What can we help you with?"
          description="Choose a department to begin your request or application."
        />
        <div className="service-grid">
          {services.map((service) => (
            <Link to={service.href} key={service.id}>
              <div className="service-card-topline">
                <i>{service.icon}</i>
                <small>Available online</small>
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <span>
                Open service <b aria-hidden="true">→</b>
              </span>
            </Link>
          ))}
        </div>
        <div className="services-help">
          <div>
            <span className="eyebrow">Need assistance?</span>
            <h3>Not sure which service to choose?</h3>
            <p>Visit the complete directory or contact the city help desk for guidance.</p>
          </div>
          <Link className="button button-outline" to="/contact">
            Contact the Help Desk
          </Link>
        </div>
      </section>
    </div>
  )
}

const bploOptions = [
  [
    'New Business Permit',
    'Register and apply for a new business permit.',
    '/services/bplo/requirements',
    '＋',
    'Start a business',
  ],
  [
    'Renew Business Permit',
    'Renew your existing permit online.',
    '/services/bplo/apply',
    '↻',
    'Keep records current',
  ],
  [
    'Retire Business',
    'Submit a request to retire a business.',
    '/services/bplo/apply',
    '×',
    'Close a registration',
  ],
  [
    'Request Certification',
    'Request a certified business record.',
    '/services/bplo/apply',
    '▤',
    'Get official records',
  ],
  [
    'Track Application',
    'Check your application status.',
    '/services/bplo/apply',
    '◎',
    'Follow your progress',
  ],
  [
    'Business Locator',
    'Verify businesses registered in Bacolod.',
    '/local-business',
    '⌖',
    'Explore local business',
  ],
]

function BploPage() {
  return (
    <div className="bplo-page">
      <section className="bplo-hero">
        <div className="page-width">
          <span className="bplo-kicker">✦ Business Permits &amp; Licensing Office</span>
          <h1>Build Your Business in Bacolod</h1>
          <p>
            Apply, renew, and manage your business permits through one convenient city service
            center.
          </p>
          <div className="bplo-highlights" aria-label="BPLO service highlights">
            <span>✓ Guided applications</span>
            <span>◷ Online convenience</span>
            <span>⌖ Local business support</span>
          </div>
        </div>
      </section>

      <section className="bplo-services page-width">
        <Title
          eyebrow="Choose a service"
          title="What would you like to do today?"
          description="Select an option to begin your permit or licensing request."
        />
        <div className="bplo-grid">
          {bploOptions.map(([title, copy, href, icon, label]) => (
            <Link key={title} to={href}>
              <div className="bplo-card-topline">
                <i aria-hidden="true">{icon}</i>
                <small>{label}</small>
              </div>
              <h3>{title}</h3>
              <p>{copy}</p>
              <span>
                Continue <b aria-hidden="true">→</b>
              </span>
            </Link>
          ))}
        </div>

        <div className="bplo-assistance">
          <span className="bplo-assistance-icon" aria-hidden="true">
            ?
          </span>
          <div>
            <span className="eyebrow">BPLO assistance</span>
            <h2>Need help with your application?</h2>
            <p>Our help desk can guide you through requirements, submissions, and renewals.</p>
          </div>
          <a className="button button-outline" href="tel:+63344349122">
            Call (034) 434-9122
          </a>
        </div>
      </section>
    </div>
  )
}

function RequirementsPage() {
  const [checked, setChecked] = useState([false, false, false])
  const readyCount = checked.filter(Boolean).length

  return (
    <div className="requirements-page">
      <section className="requirements-hero">
        <div className="page-width">
          <Link className="back-link" to="/services/bplo">
            ← Back to BPLO Services
          </Link>
          <span className="requirements-kicker">✦ New Business Permit</span>
          <h1>Prepare Your Application</h1>
          <p>Review the documents you need, mark each one ready, then begin your application.</p>
          <div className="requirements-highlights" aria-label="Application information">
            <span>3 required documents</span>
            <span>PDF, JPG, or PNG</span>
            <span>Secure online submission</span>
          </div>
        </div>
      </section>

      <section className="requirements-content page-width">
        <div className="requirements-layout">
          <div className="requirements-card">
            <div className="requirements-card-heading">
              <div>
                <span className="eyebrow">Document checklist</span>
                <h2>Required documents</h2>
              </div>
              <strong>{readyCount}/3 ready</strong>
            </div>
            {[
              'Unified Application Form for New Business Permit',
              'Articles of Incorporation / DTI Registration',
              'Barangay Business Clearance with official receipt',
            ].map((item, index) => (
              <label className={checked[index] ? 'is-ready' : ''} key={item}>
                <span className="requirement-number" aria-hidden="true">
                  {checked[index] ? '✓' : `0${index + 1}`}
                </span>
                <span>
                  <b>{item}</b>
                  <small>PDF, JPG, or PNG · maximum 10 MB</small>
                </span>
                <input
                  type="checkbox"
                  checked={checked[index]}
                  aria-label={`Mark ${item} as ready`}
                  onChange={() =>
                    setChecked((all) => all.map((value, i) => (i === index ? !value : value)))
                  }
                />
              </label>
            ))}
            <div className="requirements-progress-copy">
              <span>Application readiness</span>
              <b>{Math.round((readyCount / 3) * 100)}%</b>
            </div>
            <div className="progress" aria-label={`${readyCount} of 3 requirements ready`}>
              <span style={{ width: `${(readyCount / 3) * 100}%` }} />
            </div>
          </div>

          <aside>
            <span className="requirements-aside-icon" aria-hidden="true">
              ▤
            </span>
            <span className="eyebrow">Next step</span>
            <h2>Apply for a New Business Permit</h2>
            <p>Once your documents are ready, begin the secure online application.</p>
            <Link className="button" to="/services/bplo/apply">
              Start application →
            </Link>
            <div className="requirements-help">
              <b>Need help?</b>
              <p>Speak with the BPLO help desk for document and application guidance.</p>
              <a href="tel:+63344349122">Call (034) 434-9122</a>
            </div>
          </aside>
        </div>

        <div className="requirements-note">
          <span aria-hidden="true">i</span>
          <p>
            Check that every document is clear and complete before uploading it. This helps the city
            review your application faster.
          </p>
        </div>
      </section>
    </div>
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
      <div className="permit-page permit-success-page">
        <section className="permit-success-wrap page-width">
          <div className="success-panel">
            <span className="permit-success-kicker">Application submitted</span>
            <i>✓</i>
            <h1>Application received</h1>
            <p>Your new business permit application has been securely sent to the BPLO.</p>
            <div className="permit-reference">
              <small>Your reference number</small>
              <b>BPLO-{Date.now().toString().slice(-7)}</b>
            </div>
            <div className="permit-success-actions">
              <Link className="button" to="/services/bplo">
                Return to BPLO
              </Link>
              <Link className="button button-outline" to="/services/bplo/apply">
                Start another application
              </Link>
            </div>
          </div>
        </section>
      </div>
    )

  const stepDetails = [
    ['Applicant information', 'Tell us who is submitting this permit application.'],
    ['Business information', 'Enter the details of the business you are registering.'],
    ['Review and submit', 'Confirm that your application information is accurate.'],
  ]

  return (
    <div className="permit-page">
      <section className="permit-hero">
        <div className="page-width">
          <Link className="back-link" to="/services/bplo/requirements">
            ← Back to requirements
          </Link>
          <span className="permit-kicker">✦ New Business Permit</span>
          <h1>Apply Online with Ease</h1>
          <p>Complete three short steps to submit your business permit application securely.</p>
        </div>
      </section>

      <section className="permit-content page-width">
        <div className="stepper" aria-label={`Application step ${step} of 3`}>
          {['Applicant', 'Business', 'Review'].map((label, index) => (
            <span
              className={step >= index + 1 ? 'active' : ''}
              aria-current={step === index + 1 ? 'step' : undefined}
              key={label}
            >
              <i>{step > index + 1 ? '✓' : index + 1}</i>
              <b>{label}</b>
            </span>
          ))}
        </div>

        <div className="permit-layout">
          <form className="form-card permit-form" onSubmit={handleSubmit}>
            <div className="permit-form-heading">
              <span className="eyebrow">Step {step} of 3</span>
              <h2>{stepDetails[step - 1][0]}</h2>
              <p>{stepDetails[step - 1][1]}</p>
            </div>

            {step === 1 && (
              <div className="permit-fields">
                <label>
                  <span>Applicant name</span>
                  <input required autoComplete="name" placeholder="Juan Dela Cruz" />
                </label>
                <label>
                  <span>Email address</span>
                  <input
                    required
                    type="email"
                    autoComplete="email"
                    placeholder="juan@example.com"
                  />
                </label>
                <label>
                  <span>Mobile number</span>
                  <input required type="tel" autoComplete="tel" placeholder="09XX XXX XXXX" />
                </label>
              </div>
            )}
            {step === 2 && (
              <div className="permit-fields">
                <label>
                  <span>Business name</span>
                  <input required placeholder="Registered business name" />
                </label>
                <label>
                  <span>Business type</span>
                  <select>
                    <option>Sole Proprietorship</option>
                    <option>Partnership</option>
                    <option>Corporation</option>
                  </select>
                </label>
                <label className="permit-field-wide">
                  <span>Business address</span>
                  <textarea required rows={3} placeholder="Street, barangay, Bacolod City" />
                </label>
              </div>
            )}
            {step === 3 && (
              <div className="review-box">
                <span className="review-icon" aria-hidden="true">
                  ✓
                </span>
                <h3>Ready for submission</h3>
                <p>
                  By submitting this application, you confirm the information provided is complete
                  and accurate.
                </p>
                <label className="check-line">
                  <input required type="checkbox" />
                  <span>I certify that the information is correct.</span>
                </label>
              </div>
            )}
            <div className="form-actions">
              {step > 1 && (
                <button
                  type="button"
                  className="button button-muted"
                  onClick={() => setStep(step - 1)}
                >
                  ← Back
                </button>
              )}
              <button className="button">{step === 3 ? 'Submit application' : 'Continue'} →</button>
            </div>
          </form>

          <aside className="permit-aside">
            <span className="permit-aside-icon" aria-hidden="true">
              ◷
            </span>
            <span className="eyebrow">Save time online</span>
            <h2>Your application is secure</h2>
            <p>Review your entries before continuing. Required fields are checked at every step.</p>
            <ul>
              <li>Secure city submission</li>
              <li>Guided three-step process</li>
              <li>Reference number after submission</li>
            </ul>
            <div className="permit-help">
              <b>Need assistance?</b>
              <a href="tel:+63344349122">Call BPLO at (034) 434-9122</a>
            </div>
          </aside>
        </div>

        <div className="permit-privacy">
          <span aria-hidden="true">◆</span>
          <p>Your information is used only to process your Bacolod City permit application.</p>
        </div>
      </section>
    </div>
  )
}

export { BploPage, PermitApplication, RequirementsPage }
export default ServicesPage
