import { ArrowRight, FileText, Sparkles } from 'lucide-react'

const BIDS_URL = 'https://bacolodcity.gov.ph/bids-and-awards/'

function BidsPage({ procurement = false }: { procurement?: boolean }) {
  return (
    <div className="contact-page min-h-screen bg-orange-50/30 font-sans text-brand-ink">
      <section className="contact-hero text-center">
        <div className="page-width">
          <span className="contact-kicker inline-flex items-center justify-center">
            <Sparkles aria-hidden="true" /> Open and transparent governance
          </span>
          <h1>Bids &amp; Opportunities</h1>
          <p>
            {procurement
              ? 'Procurement plans and public purchasing information from Bacolod City.'
              : 'Procurement opportunities and awards from Bacolod City.'}
          </p>
        </div>
      </section>
      <section className="contact-content page-width">
        <div className="contact-form-panel rounded-2xl bg-white">
          <div className="contact-success">
            <i aria-hidden="true">
              <FileText />
            </i>
            <span className="eyebrow">Official city records</span>
            <h2>View bids on the city website</h2>
            <p>Bids and awards are published on the official Bacolod City website.</p>
            <a className="button" href={BIDS_URL} target="_blank" rel="noreferrer">
              Open bids and awards <ArrowRight aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default BidsPage
