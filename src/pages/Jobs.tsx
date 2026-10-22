import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { jobs } from '../data'

function JobsPage() {
  const [query, setQuery] = useState('')
  const shown = useMemo(
    () => jobs.filter((job) => job.join(' ').toLowerCase().includes(query.toLowerCase())),
    [query],
  )
  return (
    <div className="jobs-page">
      <section className="jobs-hero">
        <div className="page-width">
          <span className="jobs-kicker">✦ Careers in the City of Smiles</span>
          <h1>Build Your Future With Bacolod</h1>
          <p>
            Find meaningful opportunities, grow your career, and help deliver better public service
            for every Bacolodnon.
          </p>
          <div className="jobs-highlights" aria-label="Job listing highlights">
            <span>
              <b>{jobs.length}</b> Open positions
            </span>
            <span>
              <b>Local</b> Opportunities
            </span>
            <span>
              <b>Public</b> Service careers
            </span>
          </div>
          <div className="jobs-search">
            <span className="jobs-search-icon" aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by job title, office, or employment type"
              aria-label="Search jobs"
            />
            <button className="button">Search Jobs</button>
          </div>
        </div>
      </section>
      <section className="jobs-content page-width">
        <div className="jobs-heading">
          <div>
            <span className="eyebrow">Current vacancies</span>
            <h2>Opportunities for every talent</h2>
          </div>
          <p>{shown.length} positions shown</p>
        </div>
        <div className="filter-pills jobs-filters">
          <button>All Jobs</button>
          <button>Administrative</button>
          <button>Engineering</button>
          <button>Technology</button>
          <button>Healthcare</button>
        </div>
        <div className="job-list">
          {shown.map(([title, office, salary, type]) => (
            <article key={title}>
              <div className="job-details">
                <span>{type}</span>
                <h3>{title}</h3>
                <p>{office}</p>
                <small>⌖ Bacolod City · {salary}</small>
              </div>
              <Link className="button button-outline" to="/services">
                Apply Now
              </Link>
            </article>
          ))}
          {shown.length === 0 && (
            <div className="jobs-empty">
              <i aria-hidden="true">⌕</i>
              <h3>No matching positions</h3>
              <p>Try another title, office, or employment type.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default JobsPage
