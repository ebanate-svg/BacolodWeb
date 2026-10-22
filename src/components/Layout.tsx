import { useEffect, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import Footer from './Footer'
import Header from './Header'

function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}

export default Layout
