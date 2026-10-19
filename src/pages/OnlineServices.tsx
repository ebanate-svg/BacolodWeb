import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import Title from '../components/Title'
import { services } from '../data'
import { asset } from '../utils/assets'

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

export { BploPage, PermitApplication, RequirementsPage }
export default ServicesPage
