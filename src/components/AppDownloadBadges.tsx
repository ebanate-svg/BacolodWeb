export function GooglePlayIcon() {
  return (
    <svg className="google-play-icon" viewBox="0 0 32 34" aria-hidden="true">
      <path fill="#21c45b" d="M2 2.7v28.6L18.5 17 2 2.7Z" />
      <path fill="#23a8f2" d="m2 2.7 20.2 11.7-3.7 2.6L2 2.7Z" />
      <path fill="#f8c62b" d="m2 31.3 20.2-11.7-3.7-2.6L2 31.3Z" />
      <path fill="#f14b3f" d="m22.2 14.4 5.2 3c1 .6 1 1.5 0 2.1l-5.2 3-3.7-5.5 3.7-2.6Z" />
    </svg>
  )
}

export function AppleIcon() {
  return (
    <svg className="apple-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.05 12.54c-.03-3.19 2.61-4.74 2.73-4.82a5.86 5.86 0 0 0-4.61-2.5c-1.94-.2-3.82 1.16-4.81 1.16-1.02 0-2.56-1.14-4.21-1.1a6.13 6.13 0 0 0-5.16 3.15c-2.23 3.86-.57 9.53 1.57 12.65 1.07 1.53 2.31 3.24 3.96 3.18 1.61-.07 2.21-1.02 4.15-1.02 1.92 0 2.49 1.02 4.17.98 1.73-.03 2.82-1.53 3.85-3.08a12.62 12.62 0 0 0 1.76-3.58 5.56 5.56 0 0 1-3.4-5.02ZM13.9 3.17A5.63 5.63 0 0 0 15.18-.88a5.74 5.74 0 0 0-3.72 1.93 5.36 5.36 0 0 0-1.31 3.9 4.74 4.74 0 0 0 3.75-1.78Z" />
    </svg>
  )
}

function AppDownloadBadges({ className = 'app-downloads' }: { className?: string }) {
  return (
    <div className={className} aria-label="Download the Bacolod eGov mobile app">
      <a
        className="store-badge"
        href="https://play.google.com/store/apps/details?id=co.fortistech.bacolodgapp"
        target="_blank"
        rel="noreferrer"
        aria-label="Get it on Google Play"
      >
        <GooglePlayIcon />
        <span>
          <small>GET IT ON</small>
          <b>Google Play</b>
        </span>
      </a>
      <a className="store-badge" href="#app-store" aria-label="Download on the App Store">
        <AppleIcon />
        <span>
          <small>Download on the</small>
          <b>App Store</b>
        </span>
      </a>
    </div>
  )
}

export default AppDownloadBadges
