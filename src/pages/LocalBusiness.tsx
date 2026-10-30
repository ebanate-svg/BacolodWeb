import { ArrowLeft, ArrowRight, Heart, MapPin, Search, Sparkles, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import RequestModal from '../components/RequestModal'
import Title from '../components/Title'
import { businesses, localBusinesses as fallbackBusinesses, type LocalBusinessItem } from '../data'
import { loadLocalBusinesses } from '../firebase'
import { asset } from '../utils/assets'

function BusinessPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All Categories')
  const [shown, setShown] = useState<LocalBusinessItem[]>(fallbackBusinesses.slice(0, 9))
  const [categories, setCategories] = useState<string[]>(() =>
    [...new Set(fallbackBusinesses.map((business) => business.category))].sort(),
  )
  const [total, setTotal] = useState(fallbackBusinesses.length)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([null])
  const [loading, setLoading] = useState(false)
  const cursor = cursorHistory.at(-1) || null

  useEffect(() => {
    let active = true
    setLoading(true)
    const timer = window.setTimeout(async () => {
      const result = await loadLocalBusinesses({ cursor, query, category }, fallbackBusinesses)
      if (active) {
        setShown(result.items)
        setCategories(result.categories)
        setTotal(result.total)
        setNextCursor(result.nextCursor)
        setLoading(false)
      }
    }, 250)

    return () => {
      active = false
      window.clearTimeout(timer)
    }
  }, [category, cursor, query])

  const resetPagination = () => setCursorHistory([null])

  return (
    <div className="local-business-page min-h-screen bg-orange-50/30 font-sans text-brand-ink">
      <section className="local-business-hero text-center">
        <div className="page-width">
          <span className="local-business-kicker inline-flex items-center justify-center">
            <Sparkles aria-hidden="true" /> Support Bacolod Local
          </span>
          <h1>Find Something Special in the City of Smiles</h1>
          <p>
            Discover homegrown restaurants, cafés, shops, and services that bring Bacolod’s warm
            local character to life.
          </p>
          <div className="local-business-highlights" aria-label="Directory highlights">
            <span>
              <MapPin aria-hidden="true" /> Bacolod businesses
            </span>
            <span>
              <Star aria-hidden="true" /> Local favorites
            </span>
            <span>
              <Heart aria-hidden="true" /> Support the community
            </span>
          </div>
        </div>
      </section>

      <section className="local-business-directory page-width">
        <div className="local-business-intro">
          <Title
            eyebrow="Local directory"
            title="Discover Local Businesses"
            description="Search local destinations and find a new Bacolod favorite."
          />
          <span className="business-result-count">
            {total} {total === 1 ? 'place' : 'places'} found
          </span>
        </div>

        <div className="listing-search local-business-search">
          <span aria-hidden="true">
            <Search />
          </span>
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              resetPagination()
            }}
            placeholder="Search restaurants, cafés, and local favorites"
            aria-label="Search local businesses"
          />
          <select
            value={category}
            onChange={(event) => {
              setCategory(event.target.value)
              resetPagination()
            }}
            aria-label="Filter by category"
          >
            <option>All Categories</option>
            {categories.map((businessCategory) => (
              <option value={businessCategory} key={businessCategory}>
                {businessCategory}
              </option>
            ))}
          </select>
          {(query || category !== 'All Categories') && (
            <button
              className="business-clear-filter"
              type="button"
              onClick={() => {
                setQuery('')
                setCategory('All Categories')
                resetPagination()
              }}
            >
              Clear
            </button>
          )}
        </div>

        {shown.length > 0 ? (
          <div className="business-grid local-business-grid pb-4">
            {shown.map((business, index) => (
              <Link to="/local-business/21-restaurant" key={business.id}>
                <div className="business-card-image">
                  <img
                    src={business.image || asset('dining.png')}
                    alt={business.name}
                    loading="lazy"
                  />
                  <span>{index < 2 ? 'Local favorite' : 'Explore'}</span>
                </div>
                <div>
                  {business.reviewCount && business.rating ? (
                    <div
                      className="business-card-rating"
                      aria-label={`${business.rating.toFixed(1)} stars from ${business.reviewCount} reviews`}
                    >
                      {Array.from({ length: 5 }, (_, starIndex) => (
                        <Star
                          key={starIndex}
                          aria-hidden="true"
                          fill={
                            starIndex < Math.round(business.rating || 0) ? 'currentColor' : 'none'
                          }
                        />
                      ))}
                      <small>({business.reviewCount})</small>
                    </div>
                  ) : null}
                  <h3>{business.name}</h3>
                  <p>{business.category}</p>
                  <div className="business-card-footer">
                    <small>
                      <MapPin aria-hidden="true" /> {business.location}
                    </small>
                    <ArrowRight aria-hidden="true" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="business-empty-state">
            <span aria-hidden="true">
              <Search />
            </span>
            <h2>No businesses found</h2>
            <p>Try another search term or clear the selected category.</p>
            <button
              className="button"
              type="button"
              onClick={() => {
                setQuery('')
                setCategory('All Categories')
                resetPagination()
              }}
            >
              Show all businesses
            </button>
          </div>
        )}

        <div
          className="local-business-pagination flex items-center justify-center gap-3"
          aria-label="Business pagination"
        >
          <button
            className="button button-outline"
            type="button"
            disabled={cursorHistory.length === 1 || loading}
            onClick={() => setCursorHistory((history) => history.slice(0, -1))}
          >
            <ArrowLeft aria-hidden="true" /> Previous
          </button>
          <span>Page {cursorHistory.length}</span>
          <button
            className="button button-outline"
            type="button"
            disabled={!nextCursor || loading}
            onClick={() => nextCursor && setCursorHistory((history) => [...history, nextCursor])}
          >
            Next <ArrowRight aria-hidden="true" />
          </button>
        </div>

        <div className="local-business-callout flex items-center">
          <span className="local-business-callout-icon" aria-hidden="true">
            <Heart />
          </span>
          <div>
            <span className="eyebrow">Grow local</span>
            <h2>Every local purchase supports Bacolod</h2>
            <p>Explore neighborhood businesses and help our city’s entrepreneurs thrive.</p>
          </div>
          <Link className="button button-outline" to="/services/bplo">
            Business services
          </Link>
        </div>
      </section>
    </div>
  )
}

function BusinessDetail() {
  const [feedback, setFeedback] = useState(false)
  return (
    <div>
      <section
        className="business-hero"
        style={{
          backgroundImage: `linear-gradient(#1112,#111b),url(${asset('businessDetail.jpg')})`,
        }}
      >
        <Link to="/local-business">
          <ArrowLeft aria-hidden="true" /> Back to directory
        </Link>
        <div>
          <span>Filipino · Fine Dining</span>
          <h1>21 Restaurant</h1>
          <p>Authentic Negrense flavors and warm Bacolod hospitality.</p>
        </div>
      </section>
      <section className="content-page page-width font-sans text-brand-ink">
        <div className="business-summary">
          <div>
            <Title
              title="A Bacolod dining institution"
              description="A beloved destination for classic Filipino dishes, seafood specialties, and the city’s signature hospitality."
            />
            <div className="filter-pills">
              <button>Overview</button>
              <button>Menu</button>
              <button>Photos</button>
              <button>Reviews</button>
            </div>
          </div>
          <aside>
            <b>Open today</b>
            <p>11:00 AM – 10:00 PM</p>
            <p>21st Street, Bacolod City</p>
            <p>(034) 434-4091</p>
            <button className="button" onClick={() => setFeedback(true)}>
              Leave feedback
            </button>
          </aside>
        </div>
        <Title title="Popular dishes" />
        <div className="business-grid dishes">
          {businesses.slice(0, 3).map(([name, type]) => (
            <article key={name}>
              <img src={asset('dining.png')} />
              <div>
                <h3>{name}</h3>
                <p>{type}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      {feedback && <RequestModal type="Business Feedback" onClose={() => setFeedback(false)} />}
    </div>
  )
}

export { BusinessDetail }
export default BusinessPage
