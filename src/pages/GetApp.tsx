import { Phone, Sparkles } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import GetAppPanel from '../components/GetAppPanel'
import { phoneLines } from '../data'

// Each task names the tile residents tap on the G App home screen.
const appTasks: Record<string, { title: string; feature: string; copy: string }> = {
  report: {
    title: 'Report a barangay concern',
    feature: 'Community Issue Report',
    copy: 'Describe the concern and where it is, then send it to the city.',
  },
  job: {
    title: 'Apply for a job',
    feature: 'Business & Job Listing',
    copy: 'Find the job, then follow the steps to apply.',
  },
  civic: {
    title: 'Take a survey or join a consultation',
    feature: 'Civic Engagement',
    copy: 'Choose a survey or consultation and share your feedback.',
  },
  'city-services': {
    title: 'Use city online services',
    feature: 'City Services',
    copy: 'Choose the service you need, such as land tax or online payment.',
  },
  senior: {
    title: 'Senior citizen services',
    feature: 'Senior Citizen',
    copy: 'Find information and services for senior citizens.',
  },
}

function GetAppPage() {
  const [searchParams] = useSearchParams()
  const task = appTasks[searchParams.get('task') ?? '']

  return (
    <div className="contact-page min-h-screen bg-orange-50/30 font-sans text-brand-ink">
      <section className="contact-hero text-center">
        <div className="page-width">
          <span className="contact-kicker inline-flex items-center justify-center">
            <Sparkles aria-hidden="true" /> Bacolod G App
          </span>
          <h1>{task ? task.title : 'Continue in the App'}</h1>
          {task ? (
            <ol className="get-app-steps">
              <li>Download and open the Bacolod G App.</li>
              <li>
                On the home screen, tap <b>{task.feature}</b>.
              </li>
              <li>{task.copy}</li>
            </ol>
          ) : (
            <p>
              This website is for reading city information. Applications and requests are in the
              app.
            </p>
          )}
        </div>
      </section>
      <section className="contact-content page-width get-app-content">
        <GetAppPanel
          title="Download the Bacolod G App"
          copy="Apply, send requests, and give feedback through the app. It is available for Android, iPhone, and iPad."
        />
        <aside className="get-app-help">
          <h2>No phone with you, or using a shared computer?</h2>
          <p>Call the city and an officer will help you.</p>
          <a className="call-option" href={`tel:${phoneLines.hotline.tel}`}>
            <Phone aria-hidden="true" />
            <span>
              <b>BCD 6100 Hotline</b>
              <small>City concerns and requests · English and Hiligaynon</small>
              <strong>{phoneLines.hotline.display}</strong>
            </span>
          </a>
          <a className="call-option" href={`tel:${phoneLines.cityHall.tel}`}>
            <Phone aria-hidden="true" />
            <span>
              <b>City Hall</b>
              <small>Monday–Friday, 8:00 AM–5:00 PM</small>
              <strong>{phoneLines.cityHall.display}</strong>
            </span>
          </a>
        </aside>
      </section>
    </div>
  )
}

export default GetAppPage
