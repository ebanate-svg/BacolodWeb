import { useEffect, useRef, useState, type ReactNode } from 'react'

function DeferredSection({
  children,
  className,
  id,
  minHeight = 320,
}: {
  children: ReactNode
  className: string
  id?: string
  minHeight?: number
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '320px 0px', threshold: 0.01 },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`${className} deferred-section ${isVisible ? 'is-visible' : 'is-waiting'}`}
      style={!isVisible ? { minHeight } : undefined}
    >
      {isVisible ? children : <span className="section-loader" aria-hidden="true" />}
    </section>
  )
}

export default DeferredSection
