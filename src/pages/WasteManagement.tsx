import { useState } from 'react'
import Events from '../components/Events'
import RequestModal from '../components/RequestModal'
import Title from '../components/Title'
import { asset } from '../utils/assets'

function WastePage() {
  const [modal, setModal] = useState<string | null>(null)
  return (
    <div className="waste-page">
      <section className="content-page page-width">
        <Title
          title="Bacolod City Waste Management"
          description="Show next waste collection schedule for multiple barangays."
        />
        <div className="search-panel">
          <input placeholder="Enter barangay, e.g. Tanza" />
          <button className="button">Search</button>
        </div>
        <div className="action-row">
          <button className="button" onClick={() => setModal('Schedule Pickup')}>
            Schedule Pickup
          </button>
          <button className="button" onClick={() => setModal('Report Waste Issue')}>
            Report Issue
          </button>
          <button className="button">Waste Disposal Guide</button>
        </div>
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
        Never miss a pickup again! Set your reminders for
        <br />
        your barangay’s collection schedule.
      </section>
      <section className="disposal-guide page-width">
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
              <img src={asset(image)} />
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
