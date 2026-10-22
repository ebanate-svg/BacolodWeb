import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { asset } from '../utils/assets'

function Header() {
  const [open, setOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  return (
    <header className="site-header">
      <div className="nav-shell">
        <Link className="logo-link" to="/" aria-label="Bacolod City home">
          <img src={asset('G-AppLogo.png')} alt="Bacolod City" />
        </Link>
        <button
          className="menu-toggle"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          ☰
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
              aria-haspopup="true"
              aria-expanded={servicesOpen}
              onClick={(event) => {
                event.stopPropagation()
                setServicesOpen((value) => !value)
              }}
            >
              Services <b>⌄</b>
            </button>
            <span className={servicesOpen ? 'dropdown is-open' : 'dropdown'}>
              <Link to="/services">Online Services</Link>
              <Link to="/waste">Waste Management</Link>
              <Link to="/local-business">Local Business</Link>
            </span>
          </span>
          <NavLink to="/tourism">Tourism</NavLink>
          <NavLink to="/jobs">Jobs</NavLink>
          <NavLink to="/bids">Bids</NavLink>
          <NavLink to="/civic">Resources</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Header
