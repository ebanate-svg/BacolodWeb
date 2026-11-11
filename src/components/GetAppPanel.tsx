import { Smartphone } from 'lucide-react'
import AppDownloadBadges from './AppDownloadBadges'

function GetAppPanel({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="contact-form-panel rounded-2xl bg-white">
      <div className="contact-success">
        <i aria-hidden="true">
          <Smartphone />
        </i>
        <span className="eyebrow">Bacolod G App</span>
        <h2>{title}</h2>
        <p>{copy}</p>
        <AppDownloadBadges />
      </div>
    </div>
  )
}

export default GetAppPanel
