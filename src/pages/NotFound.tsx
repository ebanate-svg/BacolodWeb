import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="content-page page-width">
      <div className="success-panel">
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
