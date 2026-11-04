import { Sparkles } from 'lucide-react'
import GetAppPanel from '../components/GetAppPanel'

function GetAppPage() {
  return (
    <div className="contact-page min-h-screen bg-orange-50/30 font-sans text-brand-ink">
      <section className="contact-hero text-center">
        <div className="page-width">
          <span className="contact-kicker inline-flex items-center justify-center">
            <Sparkles aria-hidden="true" /> Bacolod G App
          </span>
          <h1>Continue in the App</h1>
          <p>
            This website is for reading city information. Applications and requests are in the app.
          </p>
        </div>
      </section>
      <section className="contact-content page-width">
        <GetAppPanel
          title="Download the Bacolod G App"
          copy="Apply, send requests, and give feedback through the app. It is available for Android, iPhone, and iPad."
        />
      </section>
    </div>
  )
}

export default GetAppPage
