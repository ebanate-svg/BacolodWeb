import { Loader2, Search, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { type JobItem } from '../data'
import { loadJobDepartments, loadLatestJobs } from '../firebase'
import { formatNewsDate } from '../utils/assets'

function JobsPage() {
  const [query, setQuery] = useState('')
  const [jobs, setJobs] = useState<JobItem[]>([])
  const [departments, setDepartments] = useState<string[]>([])
  const [activeDepartment, setActiveDepartment] = useState('All Jobs')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let active = true

    async function fetchJobs() {
      const [jobResult, departmentResult] = await Promise.all([
        loadLatestJobs([]),
        loadJobDepartments([]),
      ])
      if (active) {
        setJobs(jobResult.items.slice(0, 9))
        setDepartments(departmentResult.items)
        setLoaded(true)
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

  const isFiltering = query.trim() !== '' || activeDepartment !== 'All Jobs'

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
              <b>{loaded ? jobs.length : '…'}</b> Open positions
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
              placeholder="Search by job title, employer, or employment type"
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
          {loaded && <p>{shown.length} positions shown</p>}
        </div>
        {departments.length > 1 && (
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
        )}
        <div className="job-list" aria-busy={!loaded}>
          {!loaded && (
            <div className="jobs-empty" role="status">
              <i aria-hidden="true">
                <Loader2 className="jobs-loading-icon" />
              </i>
              <h3>Loading vacancies…</h3>
              <p>Getting the latest openings from the city.</p>
            </div>
          )}
          {shown.map((job) => (
            <article key={job.id}>
              <div className="job-details">
                <span>{job.type}</span>
                <h3>{job.title}</h3>
                <dl className="job-facts">
                  <div>
                    <dt>Employer</dt>
                    <dd>{job.department}</dd>
                  </div>
                  <div>
                    <dt>Location</dt>
                    <dd>{job.location}</dd>
                  </div>
                  <div>
                    <dt>Salary</dt>
                    <dd>{job.salary}</dd>
                  </div>
                  {job.postedAt && (
                    <div>
                      <dt>Posted</dt>
                      <dd>{formatNewsDate(job.postedAt)}</dd>
                    </div>
                  )}
                  <div className="job-facts-wide">
                    <dt>How to apply</dt>
                    <dd>{job.applicationInstructions || 'Apply in the Bacolod G App.'}</dd>
                  </div>
                </dl>
              </div>
              <Link className="button button-outline" to="/get-app?task=job">
                Apply in the G App
              </Link>
            </article>
          ))}
          {loaded && shown.length === 0 && isFiltering && (
            <div className="jobs-empty" role="status">
              <i aria-hidden="true">
                <Search />
              </i>
              <h3>No matching positions</h3>
              <p>Try another title, employer, or employment type.</p>
            </div>
          )}
          {loaded && jobs.length === 0 && !isFiltering && (
            <div className="jobs-empty" role="status">
              <i aria-hidden="true">
                <Search />
              </i>
              <h3>No vacancies to show right now</h3>
              <p>New vacancies are posted here. Please check again later.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default JobsPage
