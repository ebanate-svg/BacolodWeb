import { ArrowRight, Compass, Flower2, MapPin, Smartphone, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { destinations as fallbackDestinations, type DestinationItem } from '../data'
import { loadTopDestinations } from '../firebase'

function DestinationsPage() {
  const [destinations, setDestinations] = useState<DestinationItem[]>(fallbackDestinations)

  useEffect(() => {
    let active = true

    async function fetchDestinations() {
      const result = await loadTopDestinations(fallbackDestinations)
      if (active) setDestinations(result.items)
    }

    void fetchDestinations()
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="destinations-page min-h-screen font-sans text-brand-ink">
      <section className="destinations-hero text-center">
        <div className="page-width">
          <span className="destinations-kicker inline-flex items-center justify-center">
            <Sparkles aria-hidden="true" /> Explore the City of Smiles
          </span>
          <h1>Discover Bacolod’s Destinations</h1>
          <p>
            Browse celebrated landmarks, cultural experiences, nature escapes, and nearby
            adventures. Open the Bacolod G App when you are ready to explore further.
          </p>
          <div className="destinations-actions flex flex-wrap items-center justify-center">
            <Link className="button" to="/tourism">
              Explore Tourism
            </Link>
            <Link className="button button-light" to="/get-app">
              Get the Bacolod G App
            </Link>
          </div>
          <div
            className="destinations-highlights flex flex-wrap items-center justify-center"
            aria-label="Destination highlights"
          >
            <span>
              <Compass aria-hidden="true" /> Local adventures
            </span>
            <span>
              <Flower2 aria-hidden="true" /> Festival culture
            </span>
            <span>
              <Smartphone aria-hidden="true" /> Continue in the app
            </span>
          </div>
        </div>
      </section>

      <section className="destinations-directory page-width" aria-labelledby="destinations-title">
        <div className="destinations-directory-heading">
          <div>
            <span>Places to explore</span>
            <h2 id="destinations-title">Find your next Bacolod experience</h2>
          </div>
          <p>{destinations.length} destinations available</p>
        </div>

        <div className="all-destinations-grid">
          {destinations.map(({ id, image, title, type, description }) => (
            <Link className="all-destination-card" to="/get-app" key={id}>
              <div className="all-destination-image">
                <img src={image} alt={title} loading="lazy" />
                <span>{type}</span>
              </div>
              <div className="all-destination-copy">
                <small>
                  <MapPin aria-hidden="true" /> Bacolod and nearby Negros Occidental
                </small>
                <h3>{title}</h3>
                {description && <p>{description}</p>}
                <b>
                  View in the Bacolod G App <ArrowRight aria-hidden="true" />
                </b>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export default DestinationsPage
