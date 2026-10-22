import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { asset } from '../utils/assets'

function Header() {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const servicesActive =
    location.pathname.startsWith('/services') ||
    location.pathname.startsWith('/waste') ||
    location.pathname.startsWith('/local-business')

  return (
    <header className="site-header">
      <div className="nav-shell">
        <Link className="logo-link" to="/" aria-label="Bacolod City home">
          <img src={asset('G-AppLogo.png')} alt="Bacolod City" />
          <span>
            <b>Bacolod eGov</b>
            <small>City of Smiles</small>
          </span>
        </Link>
        <button
          className="menu-toggle"
          aria-expanded={open}
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav
          className={open ? 'is-open' : ''}
          onClick={() => {
            setOpen(false)
            setServicesOpen(false)
          }}
        >
          <NavLink to="/">Home</NavLink>
          <span
            className="nav-dropdown"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
            onFocus={() => setServicesOpen(true)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setServicesOpen(false)
            }}
          >
            <button
              className={servicesActive ? 'active' : ''}
              aria-haspopup="true"
              aria-expanded={servicesOpen}
              onClick={(event) => {
                event.stopPropagation()
                setServicesOpen((value) => !value)
              }}
            >
              Services <span className="dropdown-chevron" aria-hidden="true" />
            </button>
            <span className={servicesOpen ? 'dropdown is-open' : 'dropdown'}>
              <Link to="/services">Online Services</Link>
              <Link to="/services/bplo">Business Permits</Link>
              <Link to="/waste">Waste Management</Link>
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
