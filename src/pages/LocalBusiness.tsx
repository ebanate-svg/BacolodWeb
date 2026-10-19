import { useState } from 'react'
import { Link } from 'react-router-dom'
import RequestModal from '../components/RequestModal'
import Title from '../components/Title'
import { businesses } from '../data'
import { asset } from '../utils/assets'

function BusinessPage() {
  const [query, setQuery] = useState('')
  const shown = businesses.filter((item) =>
    item.join(' ').toLowerCase().includes(query.toLowerCase()),
  )
  return (
    <section className="content-page page-width">
      <Title
        eyebrow="Support Local"
        title="Discover Local Businesses"
        description="Explore Bacolod restaurants, cafés, shops, and services."
      />
      <div className="listing-search">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search restaurants, cafes…"
        />
        <select>
          <option>All Categories</option>
          <option>Restaurants</option>
          <option>Cafés</option>
        </select>
        <button className="button">Search</button>
      </div>
      <div className="business-grid">
        {shown.map(([name, type, image]) => (
          <Link to="/local-business/21-restaurant" key={name}>
            <img src={asset(image)} />
            <div>
              <span>★★★★★</span>
              <h3>{name}</h3>
              <p>{type}</p>
              <small>⌖ Bacolod City</small>
            </div>
          </Link>
        ))}
      </div>
    </section>
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
