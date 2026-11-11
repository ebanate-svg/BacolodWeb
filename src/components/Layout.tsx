import { useEffect, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import Footer from './Footer'
import Header from './Header'

function Layout({ children }: { children: ReactNode }) {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }

    const targetId = decodeURIComponent(hash.slice(1))
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [hash, pathname])
  return (
    <>
      <Header />
      <main className="min-h-screen font-sans text-brand-ink">
        <div className="route-enter" key={pathname}>
          {children}
        </div>
      </main>
      <Footer />
    </>
  )
}

export default Layout
