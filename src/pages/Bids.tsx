import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { bidItems } from '../data'
import { asset } from '../utils/assets'

function BidsPage({ procurement = false }: { procurement?: boolean }) {
  const [query, setQuery] = useState('')
  const shown = bidItems.filter((item) =>
    item.join(' ').toLowerCase().includes(query.toLowerCase()),
  )
  const visibleBids = shown.slice(0, procurement ? 2 : 4)
  return (
    <div className="bids-page">
      <section className="bids-hero">
        <div className="page-width">
          <span className="bids-kicker">✦ Open and transparent governance</span>
          <h1>{procurement ? 'Annual Procurement Plans' : 'Bids & Opportunities'}</h1>
          <p>
            {procurement
              ? 'Access approved procurement plans and public purchasing information from Bacolod City.'
              : 'Explore active procurement opportunities and help build a brighter Bacolod through transparent public service.'}
          </p>
          <div className="bids-highlights" aria-label="Procurement highlights">
            <span>
              <b>{bidItems.length}</b> Active listings
            </span>
            <span>
              <b>Open</b> Competition
            </span>
            <span>
              <b>Clear</b> Requirements
            </span>
          </div>
          <div className="bids-search">
            <span aria-hidden="true">⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by project, reference number, or category"
              aria-label="Search bids and procurement plans"
            />
            <button className="button">Search Bids</button>
          </div>
        </div>
      </section>
      <section className="bids-content page-width">
        <div className="bid-layout">
          <aside>
            <span className="eyebrow">Browse records</span>
            <h3>Procurement Center</h3>
            <NavLink to="/bids">All Bids</NavLink>
            <NavLink to="/procurement">Annual Procurement Plan</NavLink>
            <a href="#awards">Notice of Awards</a>
            <a href="#archive">Archive</a>
          </aside>
          <div className="bids-results">
            <div className="bids-heading">
              <div>
                <span className="eyebrow">Latest opportunities</span>
                <h2>{procurement ? 'Annual Procurement Plan' : 'All Active Bids'}</h2>
              </div>
              <p>{visibleBids.length} records shown</p>
            </div>
            <div className="bid-table">
              {visibleBids.map(([title, ref, category, date], index) => (
                <article key={ref}>
                  <div className="bid-number" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <img src={asset('pdfImg.png')} alt="PDF document" />
                  <div className="bid-details">
                    <span>{category}</span>
                    <h3>{procurement ? `${title} — Annual Plan` : title}</h3>
                    <p>
                      <b>{ref}</b> · Closing {date}
                    </p>
                  </div>
                  <button className="button button-outline">Download PDF →</button>
                </article>
              ))}
              {visibleBids.length === 0 && (
                <div className="bids-empty">
                  <i aria-hidden="true">⌕</i>
                  <h3>No matching records</h3>
                  <p>Try another project title, reference number, or category.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default BidsPage
