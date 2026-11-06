import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { asset } from '../utils/assets'

function Header() {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const servicesDropdownRef = useRef<HTMLSpanElement>(null)
  const servicesButtonRef = useRef<HTMLButtonElement>(null)
  const servicesActive =
    location.pathname.startsWith('/services') || location.pathname.startsWith('/local-business')

  useEffect(() => {
    setOpen(false)
    setServicesOpen(false)
  }, [location.pathname])

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!servicesDropdownRef.current?.contains(event.target as Node)) {
        setServicesOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && servicesOpen) {
        setServicesOpen(false)
        servicesButtonRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [servicesOpen])

  return (
    <header className="site-header sticky top-0 z-50 w-full bg-white font-sans">
      <div className="nav-shell page-width flex items-center justify-between">
        <Link className="logo-link flex items-center" to="/" aria-label="Bacolod City home">
          <img className="block object-contain" src={asset('G-AppLogo.png')} alt="Bacolod City" />
          <span className="flex flex-col">
            <b className="font-heading">Bacolod eGov</b>
            <small className="text-brand-muted">City of Smiles</small>
          </span>
        </Link>
        <button
          className="menu-toggle items-center justify-center"
          aria-expanded={open}
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => {
            setOpen((value) => !value)
            if (open) setServicesOpen(false)
          }}
        >
          <span />
          <span />
          <span />
        </button>
        <nav
          className={`${open ? 'is-open' : ''} items-center`}
          onClick={() => {
            setOpen(false)
            setServicesOpen(false)
          }}
        >
          <NavLink to="/">Home</NavLink>
          <span ref={servicesDropdownRef} className="nav-dropdown relative">
            <button
              ref={servicesButtonRef}
              className={servicesActive ? 'active' : ''}
              aria-haspopup="true"
              aria-expanded={servicesOpen}
              onClick={(event) => {
                event.stopPropagation()
                setServicesOpen((value) => !value)
              }}
            >
              Services <span className="dropdown-chevron inline-block" aria-hidden="true" />
            </button>
            <span
              className={`${servicesOpen ? 'dropdown is-open' : 'dropdown'} absolute flex flex-col`}
            >
              <Link to="/services">Online Services</Link>
              <Link to="/services/bplo">Business Permits</Link>
              <Link to="/local-business">Local Business</Link>
            </span>
          </span>
          <NavLink to="/tourism">Tourism</NavLink>
          <NavLink to="/jobs">Jobs</NavLink>
          <NavLink to="/bids">Bids</NavLink>
          <NavLink to="/civic">Resources</NavLink>
          <NavLink className="nav-contact" to="/contact">
            Contact
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Header
