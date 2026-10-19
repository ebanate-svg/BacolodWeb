import { useEffect, useState } from 'react'
import Events from '../components/Events'
import Title from '../components/Title'
import { businesses } from '../data'
import { asset } from '../utils/assets'

const tourismSlides = [
  { image: 'tourism1.png', label: 'Bacolod public plaza and lagoon' },
  { image: 'tourism2.png', label: 'A peaceful coastal destination near Bacolod' },
  { image: 'tourism3.png', label: 'The Ruins heritage landmark' },
]

const tourismSlideGroups = [
  [tourismSlides[0], tourismSlides[1]],
  [tourismSlides[2], tourismSlides[0]],
  [tourismSlides[1], tourismSlides[2]],
]

function TourismPage() {
  const [tourismSlide, setTourismSlide] = useState(0)
  const [isCarouselPaused, setIsCarouselPaused] = useState(false)
  const destinations = [
    ['destination1.png', 'Mambukal Resort', 'Nature'],
    ['destination2.png', 'Campuestohan Highland Resort', 'Adventure'],
    ['destination3.jpg', 'Lakawon Island', 'Beach'],
    ['destination4.jpg', 'Punta Taytay', 'Sunset'],
    ['destination5.png', 'MassKara Festival', 'Festival'],
    ['destination6.png', 'Negros Museum', 'Heritage'],
    ['destination7.jpg', 'The Ruins', 'Landmark'],
  ]

  useEffect(() => {
    if (isCarouselPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined
    }

    const timer = window.setInterval(() => {
      setTourismSlide((current) => (current + 1) % tourismSlideGroups.length)
    }, 4500)

    return () => window.clearInterval(timer)
  }, [isCarouselPaused])

  const moveTourismCarousel = (direction: number) => {
    setTourismSlide(
      (current) => (current + direction + tourismSlideGroups.length) % tourismSlideGroups.length,
    )
  }

  return (
    <div className="tourism-page">
      <section className="tourism-hero">
        <div>
          <span className="tourism-kicker">✦ Welcome to the City of Smiles</span>
          <h1>
            Celebrate Bacolod
            <br />
            in Every Color
          </h1>
          <p>
            Discover joyful festivals, timeless heritage, unforgettable food, and the warm
            hospitality that makes every visit worth celebrating.
          </p>
          <div className="tourism-actions">
            <a className="button" href="#destinations">
              Explore Destinations
            </a>
            <a className="button button-light" href="#dining">
              Taste Bacolod
            </a>
          </div>
          <div className="tourism-highlights" aria-label="Bacolod tourism highlights">
            <span>☀ Year-round adventures</span>
            <span>✿ Festival culture</span>
            <span>♡ Local hospitality</span>
          </div>
          <figure
            className="tourism-carousel"
            aria-label="Featured Bacolod destinations"
            aria-roledescription="carousel"
            onMouseEnter={() => setIsCarouselPaused(true)}
            onMouseLeave={() => setIsCarouselPaused(false)}
            onFocus={() => setIsCarouselPaused(true)}
            onBlur={() => setIsCarouselPaused(false)}
          >
            <div
              className="tourism-carousel-track"
              style={{ transform: `translateX(-${tourismSlide * 100}%)` }}
            >
              {tourismSlideGroups.map((group, index) => (
                <div
                  className="tourism-carousel-slide"
                  aria-hidden={tourismSlide !== index}
                  key={`tourism-group-${index}`}
                >
                  {group.map((slide, imageIndex) => (
                    <div className="tourism-carousel-image" key={`${slide.image}-${imageIndex}`}>
                      <img src={asset(slide.image)} alt={slide.label} loading="lazy" />
                      <figcaption>{slide.label}</figcaption>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <button
              className="tourism-carousel-arrow previous"
              type="button"
              aria-label="Show previous destination"
              onClick={() => moveTourismCarousel(-1)}
            >
              ‹
            </button>
            <button
              className="tourism-carousel-arrow next"
              type="button"
              aria-label="Show next destination"
              onClick={() => moveTourismCarousel(1)}
            >
              ›
            </button>
            <div className="tourism-carousel-dots" aria-label="Choose a destination slide">
              {tourismSlideGroups.map((group, index) => (
                <button
                  className={tourismSlide === index ? 'active' : ''}
                  type="button"
                  aria-label={`Show destination group ${index + 1}: ${group.map((slide) => slide.label).join(' and ')}`}
                  aria-current={tourismSlide === index ? 'true' : undefined}
                  onClick={() => setTourismSlide(index)}
                  key={`tourism-dot-${index}`}
                />
              ))}
            </div>
          </figure>
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
        <div className="destination-grid">
          {destinations.map(([image, title, type]) => (
            <article key={title}>
              <img src={asset(image)} alt={title} loading="lazy" />
              <div>
                <span>{type}</span>
                <h3>{title}</h3>
              </div>
            </article>
          ))}
        </div>
        <button className="button">View all destinations →</button>
      </section>
      <section id="dining" className="dining-section page-width">
        <Title
          title="Dining in Bacolod"
          description="Taste iconic chicken inasal, local comfort food, and celebrated desserts."
        />
        <div className="restaurant-grid">
          {businesses.slice(0, 5).map(([name, type]) => (
            <article key={name}>
              <img src={asset('dining.png')} alt={`Dining at ${name}`} loading="lazy" />
              <div>
                <span>★★★★★</span>
                <h3>{name}</h3>
                <p>{type}</p>
                <small>Open today · Bacolod City</small>
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
