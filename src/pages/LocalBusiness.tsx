import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Clock3,
  Heart,
  MapPin,
  Search,
  Smartphone,
  Sparkles,
  Star,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom'
import Title from '../components/Title'
import { type LocalBusinessItem } from '../data'
import { loadLocalBusiness, loadLocalBusinesses } from '../firebase'
import { asset } from '../utils/assets'

function BusinessPage() {
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(
    () => searchParams.get('category')?.trim() || 'All Categories',
  )
  const [shown, setShown] = useState<LocalBusinessItem[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [total, setTotal] = useState(0)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([null])
  const [loading, setLoading] = useState(true)
  const cursor = cursorHistory.at(-1) || null

  useEffect(() => {
    let active = true
    setLoading(true)
    const timer = window.setTimeout(async () => {
      const result = await loadLocalBusinesses({ cursor, query, category }, [])
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

        {loading && shown.length === 0 ? null : shown.length > 0 ? (
          <div className="business-grid local-business-grid pb-4">
            {shown.map((business, index) => (
              <Link
                to={`/local-business/${encodeURIComponent(business.id)}`}
                state={{ business }}
                key={business.id}
              >
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
  const { businessId = '' } = useParams()
  const location = useLocation()
  const navigationBusiness = (location.state as { business?: LocalBusinessItem } | null)?.business
  const initialBusiness = navigationBusiness?.id === businessId ? navigationBusiness : null
  const [business, setBusiness] = useState<LocalBusinessItem | null>(initialBusiness)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function fetchBusiness() {
      const result = await loadLocalBusiness(businessId, initialBusiness ?? undefined)
      if (active) {
        setBusiness(result)
        setLoading(false)
      }
    }

    void fetchBusiness()
    return () => {
      active = false
    }
  }, [businessId, initialBusiness])

  if (loading && !business) {
    return (
      <div className="business-detail-state page-width">
        <span className="eyebrow">Local directory</span>
        <h1>Loading business details…</h1>
      </div>
    )
  }

  if (!business) {
    return (
      <div className="business-detail-state page-width">
        <span className="eyebrow">Local directory</span>
        <h1>Business not found</h1>
        <p>This business may no longer be publicly listed.</p>
        <Link className="button" to="/local-business">
          <ArrowLeft aria-hidden="true" /> Back to directory
        </Link>
      </div>
    )
  }

  const mapQuery = `${business.name}, ${business.location}`
  const encodedMapQuery = encodeURIComponent(mapQuery)

  return (
    <div className="business-detail-page min-h-screen font-sans text-brand-ink">
      <section
        className="business-hero"
        style={{
          backgroundImage: `linear-gradient(90deg, rgb(11 24 50 / 86%), rgb(11 24 50 / 46%)),url(${business.image || asset('businessDetail.jpg')})`,
        }}
      >
        <Link className="back-link" to="/local-business">
          <ArrowLeft aria-hidden="true" /> Back to directory
        </Link>
        <div>
          <span>{business.category}</span>
          <h1>{business.name}</h1>
          <p>
            {business.description ||
              `Discover ${business.name}, a locally listed business in Bacolod City.`}
          </p>
        </div>
      </section>
      <section className="content-page business-detail-content page-width">
        <div className="business-summary business-detail-summary">
          <div className="business-detail-main">
            <Title
              eyebrow="Business information"
              title={`About ${business.name}`}
              description={
                business.description ||
                'View this public business listing and continue in the Bacolod G App for more information.'
              }
            />
            <div className="business-detail-facts">
              <article>
                <Building2 aria-hidden="true" />
                <div>
                  <small>Category</small>
                  <b>{business.category}</b>
                </div>
              </article>
              <article>
                <MapPin aria-hidden="true" />
                <div>
                  <small>Location</small>
                  <b>{business.location}</b>
                </div>
              </article>
              {business.hours && (
                <article>
                  <Clock3 aria-hidden="true" />
                  <div>
                    <small>Business hours</small>
                    <b>{business.hours}</b>
                  </div>
                </article>
              )}
            </div>
            <div className="business-map">
              <iframe
                src={`https://www.google.com/maps?q=${encodedMapQuery}&output=embed`}
                title={`${business.name} location on Google Maps`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodedMapQuery}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPin aria-hidden="true" /> Open in Google Maps
                <ArrowRight aria-hidden="true" />
              </a>
            </div>
          </div>
          <aside className="business-detail-aside">
            <i aria-hidden="true">
              <Smartphone />
            </i>
            <span className="eyebrow">Continue on mobile</span>
            <h2>View in the Bacolod G App</h2>
            <p>Open the app to find more information and available business features.</p>
            <Link className="button" to="/get-app">
              View in G-App <ArrowRight aria-hidden="true" />
            </Link>
            {business.website && (
              <a href={business.website} target="_blank" rel="noreferrer">
                Visit business website <ArrowRight aria-hidden="true" />
              </a>
            )}
          </aside>
        </div>
      </section>
    </div>
  )
}

export { BusinessDetail }
export default BusinessPage
