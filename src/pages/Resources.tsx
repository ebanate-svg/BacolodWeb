import { Heart, MousePointerClick, Sparkles, Users } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Title from '../components/Title'
import { asset } from '../utils/assets'

function CivicPage() {
  const navigate = useNavigate()
  return (
    <div className="civic-page min-h-screen bg-orange-50/30 font-sans text-brand-ink">
      <section className="civic-hero text-center">
        <div>
          <span className="civic-kicker inline-flex items-center justify-center">
            <Sparkles aria-hidden="true" /> Citizen Resources &amp; Participation
          </span>
          <h1>
            Everything You Need
            <br />
            to Shape Bacolod
          </h1>
          <p>
            Find civic tools, share feedback, report community concerns, and take part in building a
            brighter City of Smiles.
          </p>
          <div className="civic-actions flex flex-wrap items-center justify-center">
            <button className="button" onClick={() => navigate('/services')}>
              Explore Resources
            </button>
            <a className="button button-light" href="#consultations">
              View Consultations
            </a>
          </div>
          <div
            className="civic-highlights flex flex-wrap items-center justify-center"
            aria-label="Citizen resource highlights"
          >
            <span>
              <MousePointerClick aria-hidden="true" /> Easy access
            </span>
            <span>
              <Users aria-hidden="true" /> Community-led
            </span>
            <span>
              <Heart aria-hidden="true" /> Open participation
            </span>
          </div>
        </div>
      </section>
      <section id="consultations" className="resources-content page-width">
        <Title
          eyebrow="Citizen resource center"
          title="Connect With Your City"
          description="Use these simple tools to access information, share your voice, and participate in local government."
        />
        <div className="civic-grid grid">
          {[
            [
              'civic-survey.jpg',
              'Public Surveys',
              'Choose a topic',
              'Give feedback on programs, services, and city priorities.',
            ],
            [
              'civic-consultation.jpg',
              'Consultations',
              'Share your feedback',
              'Review proposals and join active public discussions.',
            ],
            [
              'civic-report-issue.jpg',
              'Report an Issue',
              'Track city action',
              'Tell the city about concerns in your barangay.',
            ],
          ].map(([image, title, step, copy], index) => (
            <article key={title}>
              <div className="civic-card-image">
                <img src={asset(image)} alt={step} loading="lazy" />
                <b className="civic-card-number">0{index + 1}</b>
              </div>
              <div className="civic-card-content">
                <span className="eyebrow">{step}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
                <Link className="button button-outline" to="/services">
                  Participate
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default CivicPage
