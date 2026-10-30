import { ArrowRight, Search, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { bidItems } from '../data'
import { loadBids } from '../firebase'
import { asset } from '../utils/assets'

function BidsPage({ procurement = false }: { procurement?: boolean }) {
  const [query, setQuery] = useState('')
  const [bids, setBids] = useState(bidItems)

  useEffect(() => {
    let active = true
    async function fetchBids() {
      const result = await loadBids(bidItems)
      if (active) setBids(result.items)
    }
    void fetchBids()
    return () => {
      active = false
    }
  }, [])

  const shown = bids.filter(({ title, reference, category }) =>
    `${title} ${reference} ${category}`.toLowerCase().includes(query.toLowerCase()),
  )
  const visibleBids = shown.slice(0, procurement ? 2 : 4)
  return (
    <div className="bids-page min-h-screen bg-orange-50/30 font-sans text-brand-ink">
      <section className="bids-hero text-center">
        <div className="page-width">
          <span className="bids-kicker inline-flex items-center justify-center">
            <Sparkles aria-hidden="true" /> Open and transparent governance
          </span>
          <h1>Bids &amp; Opportunities</h1>
          <p>
            {procurement
              ? 'Access approved procurement plans and public purchasing information from Bacolod City.'
              : 'Explore active procurement opportunities and help build a brighter Bacolod through transparent public service.'}
          </p>
          <div
            className="bids-highlights flex flex-wrap items-center justify-center"
            aria-label="Procurement highlights"
          >
            <span>
              <b>{bids.length}</b> Active listings
            </span>
            <span>
              <b>Open</b> Competition
            </span>
            <span>
              <b>Clear</b> Requirements
            </span>
          </div>
          <div className="bids-search mx-auto flex items-center bg-white">
            <Search className="bids-search-icon" aria-hidden="true" />
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
        <div className="bid-layout grid items-start">
          <aside>
            <span className="eyebrow">Browse records</span>
            <h3>Procurement Center</h3>
            <NavLink to="/bids">All Bids</NavLink>
            <NavLink to="/procurement">Annual Procurement Plan</NavLink>
            <a href="#awards">Notice of Awards</a>
            <a href="#archive">Archive</a>
          </aside>
          <div className="bids-results">
            <div className="bids-heading flex items-end justify-between">
              <div>
                <span className="eyebrow">Latest opportunities</span>
                <h2>{procurement ? 'Annual Procurement Plan' : 'All Active Bids'}</h2>
              </div>
              <p>{visibleBids.length} records shown</p>
            </div>
            <div className="bid-table">
              {visibleBids.map(
                ({ id, title, reference, category, postedAt, documentUrl }, index) => (
                  <article key={id}>
                    <div className="bid-number" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <img src={asset('pdfImg.png')} alt="PDF document" />
                    <div className="bid-details">
                      <span>{category}</span>
                      <h3>{procurement ? `${title} — Annual Plan` : title}</h3>
                      <p>
                        <b>{reference}</b>
                        {postedAt && ` · Posted ${new Date(postedAt).toLocaleDateString('en-PH')}`}
                      </p>
                    </div>
                    <a
                      className="button button-outline"
                      href={documentUrl || '#'}
                      target={documentUrl ? '_blank' : undefined}
                      rel={documentUrl ? 'noreferrer' : undefined}
                      aria-disabled={!documentUrl}
                    >
                      Download PDF <ArrowRight aria-hidden="true" />
                    </a>
                  </article>
                ),
              )}
              {visibleBids.length === 0 && (
                <div className="bids-empty">
                  <i aria-hidden="true">
                    <Search />
                  </i>
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
