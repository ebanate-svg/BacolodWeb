import { useState } from 'react'
import { Link } from 'react-router-dom'
import RequestModal from '../components/RequestModal'
import Title from '../components/Title'
import { businesses } from '../data'
import { asset } from '../utils/assets'

function BusinessPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All Categories')
  const shown = businesses.filter(([name, type]) => {
    const matchesQuery = `${name} ${type}`.toLowerCase().includes(query.trim().toLowerCase())
    const matchesCategory =
      category === 'All Categories' || type.toLowerCase().includes(category.toLowerCase())

    return matchesQuery && matchesCategory
  })

  return (
    <div className="local-business-page">
      <section className="local-business-hero">
        <div className="page-width">
          <span className="local-business-kicker">✦ Support Bacolod Local</span>
          <h1>Find Something Special in the City of Smiles</h1>
          <p>
            Discover homegrown restaurants, cafés, shops, and services that bring Bacolod’s warm
            local character to life.
          </p>
          <div className="local-business-highlights" aria-label="Directory highlights">
            <span>⌖ Bacolod businesses</span>
            <span>★ Local favorites</span>
            <span>♡ Support the community</span>
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
            {shown.length} {shown.length === 1 ? 'place' : 'places'} found
          </span>
        </div>

        <div className="listing-search local-business-search">
          <span aria-hidden="true">⌕</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search restaurants, cafés, and local favorites"
            aria-label="Search local businesses"
          />
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label="Filter by category"
          >
            <option>All Categories</option>
            <option value="Filipino">Filipino Food</option>
            <option value="Cafe">Cafés</option>
            <option value="Seafood">Seafood</option>
            <option value="Local">Local Favorites</option>
          </select>
          {(query || category !== 'All Categories') && (
            <button
              className="business-clear-filter"
              type="button"
              onClick={() => {
                setQuery('')
                setCategory('All Categories')
              }}
            >
              Clear
            </button>
          )}
        </div>

        {shown.length > 0 ? (
          <div className="business-grid local-business-grid">
            {shown.map(([name, type, image], index) => (
              <Link to="/local-business/21-restaurant" key={name}>
                <div className="business-card-image">
                  <img src={asset(image)} alt={name} loading="lazy" />
                  <span>{index < 2 ? 'Local favorite' : 'Explore'}</span>
                </div>
                <div>
                  <div className="business-card-rating" aria-label="Rated five stars">
                    ★★★★★
                  </div>
                  <h3>{name}</h3>
                  <p>{type}</p>
                  <div className="business-card-footer">
                    <small>⌖ Bacolod City</small>
                    <b aria-hidden="true">→</b>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="business-empty-state">
            <span aria-hidden="true">⌕</span>
            <h2>No businesses found</h2>
            <p>Try another search term or clear the selected category.</p>
            <button
              className="button"
              type="button"
              onClick={() => {
                setQuery('')
                setCategory('All Categories')
              }}
            >
              Show all businesses
            </button>
          </div>
        )}

        <div className="local-business-callout">
          <span className="local-business-callout-icon" aria-hidden="true">
            ♡
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
        <Link to="/local-business">← Back to directory</Link>
        <div>
          <span>Filipino · Fine Dining</span>
          <h1>21 Restaurant</h1>
          <p>Authentic Negrense flavors and warm Bacolod hospitality.</p>
        </div>
      </section>
      <section className="content-page page-width">
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
