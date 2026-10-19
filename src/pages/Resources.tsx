import { Link, useNavigate } from 'react-router-dom'
import Title from '../components/Title'
import { asset } from '../utils/assets'

function CivicPage() {
  const navigate = useNavigate()
  return (
    <div className="civic-page">
      <section className="civic-hero">
        <div>
          <span className="civic-kicker">✦ Citizen Resources & Participation</span>
          <h1>
            Everything You Need
            <br />
            to Shape Bacolod
          </h1>
          <p>
            Find civic tools, share feedback, report community concerns, and take part in building a
            brighter City of Smiles.
          </p>
          <div className="civic-actions">
            <button className="button" onClick={() => navigate('/services')}>
              Explore Resources
            </button>
            <a className="button button-light" href="#consultations">
              View Consultations
            </a>
          </div>
          <div className="civic-highlights" aria-label="Citizen resource highlights">
            <span>◉ Easy access</span>
            <span>✦ Community-led</span>
            <span>♡ Open participation</span>
          </div>
        </div>
      </section>
      <section id="consultations" className="resources-content page-width">
        <Title
          eyebrow="Citizen resource center"
          title="Connect With Your City"
          description="Use these simple tools to access information, share your voice, and participate in local government."
        />
        <div className="civic-grid">
          {[
            ['◫', 'Public Surveys', 'Give feedback on programs, services, and city priorities.'],
            ['◎', 'Consultations', 'Review proposals and join active public discussions.'],
            ['⚑', 'Report an Issue', 'Tell the city about concerns in your barangay.'],
          ].map(([icon, title, copy], index) => (
            <article key={title}>
              <b className="civic-card-number">0{index + 1}</b>
              <i>{icon}</i>
              <span>Open</span>
              <h3>{title}</h3>
              <p>{copy}</p>
              <Link className="button button-outline" to="/services">
                Participate
              </Link>
            </article>
          ))}
        </div>
        <Title
          title="How to Participate"
          description="Your contribution only takes a few minutes."
        />
        <div className="participate-grid">
          {[
            ['step1.jpg', 'Choose a topic'],
            ['step2.jpg', 'Share your feedback'],
            ['step3.png', 'Track city action'],
          ].map(([image, title], index) => (
            <article key={title}>
              <img src={asset(image)} alt={title} loading="lazy" />
              <span>0{index + 1}</span>
              <h3>{title}</h3>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default CivicPage
