import { useState } from 'react'
import Events from '../components/Events'
import RequestModal from '../components/RequestModal'
import Title from '../components/Title'
import { asset } from '../utils/assets'

function WastePage() {
  const [modal, setModal] = useState<string | null>(null)
  return (
    <div className="waste-page">
      <section className="waste-hero">
        <div className="page-width">
          <span className="waste-kicker">✦ A cleaner City of Smiles</span>
          <h1>Waste Collection Made Simple</h1>
          <p>
            Check collection schedules, arrange a pickup, and report waste concerns in your
            barangay.
          </p>
          <div className="waste-search">
            <span aria-hidden="true">⌖</span>
            <input placeholder="Enter your barangay, e.g. Tanza" aria-label="Enter barangay" />
            <button className="button">Find Schedule</button>
          </div>
          <div className="waste-highlights" aria-label="Waste management highlights">
            <span>◷ Updated schedules</span>
            <span>♻ Responsible disposal</span>
            <span>✓ Easy issue reporting</span>
          </div>
        </div>
      </section>
      <section className="waste-content page-width">
        <div className="waste-actions">
          <button className="button" onClick={() => setModal('Schedule Pickup')}>
            <i aria-hidden="true">▣</i>
            <span>
              <b>Schedule Pickup</b>
              <small>Request a collection</small>
            </span>
          </button>
          <button
            className="button waste-action-dark"
            onClick={() => setModal('Report Waste Issue')}
          >
            <i aria-hidden="true">!</i>
            <span>
              <b>Report an Issue</b>
              <small>Tell the city about a concern</small>
            </span>
          </button>
          <a className="button waste-action-light" href="#disposal-guide">
            <i aria-hidden="true">♻</i>
            <span>
              <b>Disposal Guide</b>
              <small>Learn how to sort waste</small>
            </span>
          </a>
        </div>
        <Title
          eyebrow="Collection schedule"
          title="Upcoming Barangay Pickups"
          description="Plan ahead with the next scheduled collections around Bacolod City."
        />
        <div className="schedule-cards">
          {[
            ['Nov 4 Wednesday, 8:00 AM', 'Barangay 1'],
            ['Nov 6 Friday, 9:00 AM', 'Barangay 2'],
            ['Nov 6 Friday, 10:00 AM', 'Barangay 3'],
          ].map(([time, place]) => (
            <article key={place}>
              <i>⚑</i>
              <b>{time}</b>
              <small>{place}</small>
            </article>
          ))}
        </div>
        <Events />
      </section>
      <section className="waste-banner">
        <div>
          <span aria-hidden="true">◷</span>
          <div>
            <h2>Never miss a pickup again</h2>
            <p>Set a reminder for your barangay’s next collection schedule.</p>
          </div>
          <button className="button" onClick={() => setModal('Schedule Pickup')}>
            Set a Reminder
          </button>
        </div>
      </section>
      <section id="disposal-guide" className="disposal-guide page-width">
        <Title
          title={
            <>
              Know how to dispose of your waste properly — let’s keep{' '}
              <em>Bacolod City clean and green!</em>
            </>
          }
        />
        <div className="waste-tabs">
          <button>♻ Recyclables</button>
          <button>Biodegradable</button>
          <button>Residual Waste</button>
          <button>Special Waste</button>
        </div>
        <div className="tip-grid">
          {[
            ['step1.jpg', 'Rinse containers before placing them in bins.'],
            ['step2.jpg', 'Flatten cardboard boxes to save space.'],
            ['step3.png', 'Separate glass items by color if possible.'],
          ].map(([image, copy], index) => (
            <article key={copy}>
              <img src={asset(image)} alt={copy} loading="lazy" />
              <span>0{index + 1}</span>
              <b>{copy}</b>
            </article>
          ))}
        </div>
      </section>
      {modal && <RequestModal type={modal} onClose={() => setModal(null)} />}
    </div>
  )
}

export default WastePage
