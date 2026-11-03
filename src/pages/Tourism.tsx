import { ArrowRight, CalendarDays, Flower2, Heart, Sparkles, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import Events from '../components/Events'
import Title from '../components/Title'
import {
  destinations as fallbackDestinations,
  restaurants as fallbackRestaurants,
  type DestinationItem,
  type RestaurantItem,
} from '../data'
import { loadTopDestinations, loadTopRestaurants } from '../firebase'
import { asset } from '../utils/assets'

const tourismSlides = [
  { image: 'tourism1.png', label: 'Bacolod public plaza and lagoon' },
  { image: 'tourism2.png', label: 'A peaceful coastal destination near Bacolod' },
  { image: 'tourism3.png', label: 'The Ruins heritage landmark' },
]

function TourismPage() {
  const [tourismSlide, setTourismSlide] = useState(0)
  const [destinations, setDestinations] = useState<DestinationItem[]>(fallbackDestinations)
  const [restaurants, setRestaurants] = useState<RestaurantItem[]>(fallbackRestaurants)

  useEffect(() => {
    let active = true

    async function fetchTourismContent() {
      const [destinationResult, restaurantResult] = await Promise.all([
        loadTopDestinations(fallbackDestinations),
        loadTopRestaurants(fallbackRestaurants),
      ])
      if (active) {
        setDestinations(destinationResult.items.slice(0, 7))
        setRestaurants(restaurantResult.items.slice(0, 5))
      }
    }

    void fetchTourismContent()
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined
    }

    const timer = window.setInterval(() => {
      setTourismSlide((current) => (current + 1) % tourismSlides.length)
    }, 4500)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="tourism-page min-h-screen bg-orange-50/30 font-sans text-brand-ink">
      <section className="tourism-hero relative overflow-hidden text-center">
        <div className="tourism-hero-background absolute inset-0" aria-hidden="true">
          {tourismSlides.map((slide, index) => (
            <img
              className={tourismSlide === index ? 'active' : ''}
              src={asset(slide.image)}
              alt=""
              key={slide.image}
            />
          ))}
        </div>
        <div className="tourism-hero-content relative z-10 mx-auto">
          <span className="tourism-kicker inline-flex items-center justify-center">
            <Sparkles aria-hidden="true" /> Welcome to the City of Smiles
          </span>
          <h1>
            Celebrate Bacolod
            <br />
            in Every Color
          </h1>
          <p>
            Discover joyful festivals, timeless heritage, unforgettable food, and the warm
            hospitality that makes every visit worth celebrating.
          </p>
          <div className="tourism-actions flex flex-wrap items-center justify-center">
            <a className="button" href="#destinations">
              Explore Destinations
            </a>
            <a className="button button-light" href="#dining">
              Discover Local Flavors
            </a>
          </div>
          <div className="tourism-highlights" aria-label="Bacolod tourism highlights">
            <span>
              <CalendarDays aria-hidden="true" /> Year-round adventures
            </span>
            <span>
              <Flower2 aria-hidden="true" /> Festival culture
            </span>
            <span>
              <Heart aria-hidden="true" /> Local hospitality
            </span>
          </div>
        </div>
      </section>
      <section id="destinations" className="tour-section page-width">
        <Title
          eyebrow="Tourist Spots"
          title={
            <>
              Explore Bacolod’s <em>Top Destinations</em>
            </>
          }
          description="From heritage landmarks to natural escapes—discover what makes Bacolod truly unforgettable."
        />
        <div className="destination-grid grid">
          {destinations.map(({ id, image, title, type }) => (
            <article key={id}>
              <img src={image} alt={title} loading="lazy" />
              <div>
                <span>{type}</span>
                <h3>{title}</h3>
              </div>
            </article>
          ))}
        </div>
        <button className="button">
          View all destinations <ArrowRight aria-hidden="true" />
        </button>
      </section>
      <section id="dining" className="dining-section page-width">
        <Title
          title="Dining in Bacolod"
          description="Taste iconic chicken inasal, local comfort food, and celebrated desserts."
        />
        <div className="restaurant-grid grid">
          {restaurants.map(({ id, name, type, image, location, hours, rating }) => (
            <article key={id}>
              <img src={image} alt={`Dining at ${name}`} loading="lazy" />
              <div>
                <span className="rating-stars" aria-label="Rated five stars">
                  {Array.from(
                    { length: Math.max(1, Math.min(5, Math.round(rating))) },
                    (_, index) => (
                      <Star key={index} aria-hidden="true" fill="currentColor" />
                    ),
                  )}
                </span>
                <h3>{name}</h3>
                <p>{type}</p>
                <small>
                  {hours} · {location}
                </small>
              </div>
            </article>
          ))}
        </div>
      </section>
      <Events />
    </div>
  )
}

export default TourismPage
