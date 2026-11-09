import {
  Accessibility,
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  ClipboardCheck,
  ClipboardList,
  Clock3,
  FileBadge,
  HelpCircle,
  Info,
  MapPin,
  MapPinned,
  MonitorCog,
  Plus,
  RefreshCcw,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  XCircle,
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Title from '../components/Title'
import { services } from '../data'

const serviceIcons = {
  business: Building2,
  technology: MonitorCog,
  tracker: ScanSearch,
  senior: Accessibility,
}

function ServicesPage() {
  return (
    <div className="services-page min-h-screen bg-orange-50/30 font-sans text-brand-ink">
      <section className="services-hero text-center">
        <div className="page-width">
          <span className="services-kicker inline-flex items-center justify-center">
            <Sparkles aria-hidden="true" /> Bacolod City Online Services
          </span>
          <h1>City Services, One Easy Platform</h1>
          <p>
            Apply, request, and access essential government services from wherever you are—securely
            and conveniently.
          </p>
          <div className="services-highlights" aria-label="Online service highlights">
            <span>
              <Clock3 aria-hidden="true" /> Available 24/7
            </span>
            <span>
              <ShieldCheck aria-hidden="true" /> Secure transactions
            </span>
            <span>
              <MapPin aria-hidden="true" /> Built for Bacolodnons
            </span>
          </div>
        </div>
      </section>
      <section className="services-catalog page-width">
        <Title
          eyebrow="Digital service center"
          title="What can we help you with?"
          description="Choose a department to begin your request or application."
        />
        <div className="service-grid grid">
          {services.map((service) => {
            const ServiceIcon = serviceIcons[service.icon]
            const content = (
              <>
                <div className="service-card-topline">
                  <i aria-hidden="true">
                    <ServiceIcon />
                  </i>
                  <small>{service.external ? 'Available in G-App' : 'Available online'}</small>
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <span>
                  {service.external ? 'Open in G-App' : 'Open service'}{' '}
                  <ArrowRight aria-hidden="true" />
                </span>
              </>
            )

            return (
              <Link to={service.href} key={service.id}>
                {content}
              </Link>
            )
          })}
        </div>
        <div className="services-help flex items-center justify-between">
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

const BACOLOD_PERMITS_URL = 'https://permits.bacolodcity.gov.ph/'

const bploOptions = [
  [
    'New Business Permit',
    'Register and apply for a new business permit.',
    BACOLOD_PERMITS_URL,
    'new',
    'Start a business',
  ],
  [
    'Renew Business Permit',
    'Renew your existing permit online.',
    BACOLOD_PERMITS_URL,
    'renew',
    'Keep records current',
  ],
  [
    'Retire Business',
    'Submit a request to retire a business.',
    BACOLOD_PERMITS_URL,
    'retire',
    'Close a registration',
  ],
  [
    'Request Certification',
    'Request a certified business record.',
    BACOLOD_PERMITS_URL,
    'certificate',
    'Get official records',
  ],
  [
    'Track Application',
    'Check your application status.',
    '/get-app',
    'track',
    'Follow your progress',
  ],
  [
    'Business Locator',
    'Verify businesses registered in Bacolod.',
    '/local-business',
    'locator',
    'Explore local business',
  ],
]

const bploIcons = {
  new: Plus,
  renew: RefreshCcw,
  retire: XCircle,
  certificate: FileBadge,
  track: ScanSearch,
  locator: MapPinned,
}

function BploPage() {
  return (
    <div className="bplo-page min-h-screen bg-orange-50/30 font-sans text-brand-ink">
      <section className="bplo-hero text-center">
        <div className="page-width">
          <span className="bplo-kicker">
            <Sparkles aria-hidden="true" /> Business Permits &amp; Licensing Office
          </span>
          <h1>Build Your Business in Bacolod</h1>
          <p>
            Apply, renew, and manage your business permits through one convenient city service
            center.
          </p>
          <div className="bplo-highlights" aria-label="BPLO service highlights">
            <span>
              <ClipboardCheck aria-hidden="true" /> Guided applications
            </span>
            <span>
              <Clock3 aria-hidden="true" /> Online convenience
            </span>
            <span>
              <MapPin aria-hidden="true" /> Local business support
            </span>
          </div>
        </div>
      </section>

      <section className="bplo-services page-width">
        <Title
          eyebrow="Choose a service"
          title="What would you like to do today?"
          description="Select an option to begin your permit or licensing request."
        />
        <div className="bplo-grid grid">
          {bploOptions.map(([title, copy, href, icon, label]) => {
            const BploIcon = bploIcons[icon as keyof typeof bploIcons]
            const content = (
              <>
                <div className="bplo-card-topline">
                  <i aria-hidden="true">
                    <BploIcon />
                  </i>
                  <small>{label}</small>
                </div>
                <h3>{title}</h3>
                <p>{copy}</p>
                <span>
                  Continue <ArrowRight aria-hidden="true" />
                </span>
              </>
            )

            return href.startsWith('http') ? (
              <a href={href} target="_blank" rel="noopener noreferrer" key={title}>
                {content}
              </a>
            ) : (
              <Link key={title} to={href}>
                {content}
              </Link>
            )
          })}
        </div>

        <div className="bplo-assistance">
          <span className="bplo-assistance-icon" aria-hidden="true">
            <HelpCircle />
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
    <div className="requirements-page min-h-screen bg-orange-50/30 font-sans text-brand-ink">
      <section className="requirements-hero text-center">
        <div className="page-width">
          <Link className="back-link" to="/services/bplo">
            <ArrowLeft aria-hidden="true" /> Back to BPLO Services
          </Link>
          <span className="requirements-kicker">
            <Sparkles aria-hidden="true" /> New Business Permit
          </span>
          <h1>Prepare Your Application</h1>
          <p>Review the documents you need, then apply through the Bacolod G App.</p>
          <div className="requirements-highlights" aria-label="Application information">
            <span>3 required documents</span>
            <span>PDF, JPG, or PNG</span>
            <span>Apply through the G App</span>
          </div>
        </div>
      </section>

      <section className="requirements-content page-width">
        <div className="requirements-layout grid items-start">
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
                  {checked[index] ? <Check /> : `0${index + 1}`}
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
              <ClipboardList />
            </span>
            <span className="eyebrow">Next step</span>
            <h2>Apply for a New Business Permit</h2>
            <p>Once your documents are ready, apply through the Bacolod G App.</p>
            <Link className="button" to="/get-app">
              Get the app <ArrowRight aria-hidden="true" />
            </Link>
            <div className="requirements-help">
              <b>Need help?</b>
              <p>Speak with the BPLO help desk for document and application guidance.</p>
              <a href="tel:+63344349122">Call (034) 434-9122</a>
            </div>
          </aside>
        </div>

        <div className="requirements-note">
          <span aria-hidden="true">
            <Info />
          </span>
          <p>
            Check that every document is clear and complete before uploading it. This helps the city
            review your application faster.
          </p>
        </div>
      </section>
    </div>
  )
}

export { BploPage, RequirementsPage }
export default ServicesPage
