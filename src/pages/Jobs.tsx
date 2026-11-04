import { MapPin, Search, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { jobs as fallbackJobs, type JobItem } from '../data'
import { loadJobDepartments, loadLatestJobs } from '../firebase'

function JobsPage() {
  const [query, setQuery] = useState('')
  const [jobs, setJobs] = useState<JobItem[]>(fallbackJobs)
  const [departments, setDepartments] = useState<string[]>(() =>
    Array.from(new Set(fallbackJobs.map((job) => job.department))),
  )
  const [activeDepartment, setActiveDepartment] = useState('All Jobs')

  useEffect(() => {
    let active = true
    const fallbackDepartments = Array.from(new Set(fallbackJobs.map((job) => job.department)))

    async function fetchJobs() {
      const [jobResult, departmentResult] = await Promise.all([
        loadLatestJobs(fallbackJobs),
        loadJobDepartments(fallbackDepartments),
      ])
      if (active) {
        setJobs(jobResult.items.slice(0, 9))
        setDepartments(departmentResult.items)
      }
    }

    void fetchJobs()
    return () => {
      active = false
    }
  }, [])

  const shown = useMemo(
    () =>
      jobs.filter((job) => {
        const matchesDepartment =
          activeDepartment === 'All Jobs' || job.department === activeDepartment
        const matchesQuery = Object.values(job)
          .join(' ')
          .toLowerCase()
          .includes(query.toLowerCase())
        return matchesDepartment && matchesQuery
      }),
    [activeDepartment, jobs, query],
  )
  return (
    <div className="jobs-page min-h-screen bg-orange-50/30 font-sans text-brand-ink">
      <section className="jobs-hero text-center">
        <div className="page-width">
          <span className="jobs-kicker inline-flex items-center justify-center">
            <Sparkles aria-hidden="true" /> Careers in the City of Smiles
          </span>
          <h1>Build Your Future With Bacolod</h1>
          <p>
            Find meaningful opportunities, grow your career, and help deliver better public service
            for every Bacolodnon.
          </p>
          <div
            className="jobs-highlights flex flex-wrap items-center justify-center"
            aria-label="Job listing highlights"
          >
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
          <div className="jobs-search mx-auto flex items-center bg-white">
            <Search className="jobs-search-icon" aria-hidden="true" />
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
        <div className="jobs-heading flex items-end justify-between">
          <div>
            <span className="eyebrow">Current vacancies</span>
            <h2>Opportunities for every talent</h2>
          </div>
          <p>{shown.length} positions shown</p>
        </div>
        <div className="filter-pills jobs-filters">
          {['All Jobs', ...departments].map((department) => (
            <button
              className={activeDepartment === department ? 'active' : ''}
              key={department}
              onClick={() => setActiveDepartment(department)}
            >
              {department}
            </button>
          ))}
        </div>
        <div className="job-list">
          {shown.map(({ id, title, department, salary, type, location }) => (
            <article key={id}>
              <div className="job-details">
                <span>{type}</span>
                <h3>{title}</h3>
                <p>{department}</p>
                <small>
                  <MapPin aria-hidden="true" /> {location} · {salary}
                </small>
              </div>
              <Link className="button button-outline" to="/get-app">
                Apply Now
              </Link>
            </article>
          ))}
          {shown.length === 0 && (
            <div className="jobs-empty">
              <i aria-hidden="true">
                <Search />
              </i>
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
