import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="content-page page-width flex min-h-[60vh] items-center justify-center font-sans text-brand-ink">
      <div className="success-panel text-center">
        <i>404</i>
        <h2>Page not found</h2>
        <Link className="button" to="/">
          Return home
        </Link>
      </div>
    </section>
  )
}

export default NotFound
