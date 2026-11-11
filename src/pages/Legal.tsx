import { FileCheck2, Scale, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

const effectiveDate = 'November 9, 2026'

function LegalLayout({
  type,
  title,
  summary,
  children,
}: {
  type: 'terms' | 'privacy'
  title: string
  summary: string
  children: React.ReactNode
}) {
  const Icon = type === 'terms' ? Scale : ShieldCheck

  return (
    <div className="legal-page min-h-screen font-sans text-brand-ink">
      <section className="legal-hero text-center">
        <div className="page-width">
          <span className="legal-kicker inline-flex items-center justify-center">
            <Icon aria-hidden="true" /> Bacolod eGov Web
          </span>
          <h1>{title}</h1>
          <p>{summary}</p>
          <small>Effective date: {effectiveDate}</small>
        </div>
      </section>

      <section className="legal-content page-width">
        <aside className="legal-review-note">
          <FileCheck2 aria-hidden="true" />
          <div>
            <b>City review recommended</b>
            <p>
              This public-facing policy should be reviewed and approved by the City Government’s
              legal office and Data Protection Officer before final production publication.
            </p>
          </div>
        </aside>
        <article className="legal-document">{children}</article>
      </section>
    </div>
  )
}

function TermsPage() {
  return (
    <LegalLayout
      type="terms"
      title="Terms and Conditions"
      summary="The conditions that apply when you access and use the Bacolod eGov Web portal."
    >
      <section>
        <h2>1. Acceptance of these terms</h2>
        <p>
          By accessing or using Bacolod eGov Web (the “Portal”), you acknowledge that you have read
          and understood these Terms and Conditions. If you do not agree with them, please stop
          using the Portal.
        </p>
      </section>

      <section>
        <h2>2. Purpose of the Portal</h2>
        <p>
          The Portal provides public information about Bacolod City services, news, events, tourism,
          job opportunities, procurement, local businesses, and citizen resources. It is primarily
          an information and discovery service.
        </p>
        <p>
          Unless a page expressly states otherwise, the Portal does not accept official
          applications, payments, reports, requests, or legal filings. Those activities are
          completed through the Bacolod G App or the applicable official government service.
        </p>
      </section>

      <section>
        <h2>3. Information and availability</h2>
        <p>
          The City endeavors to keep Portal information accurate and current, but some information
          may be delayed, incomplete, or temporarily unavailable. Users should confirm deadlines,
          requirements, fees, office schedules, and official notices with the responsible city
          office before relying on them.
        </p>
        <p>
          The City may update, suspend, restrict, or discontinue any part of the Portal for
          maintenance, security, operational, or public-service reasons.
        </p>
      </section>

      <section>
        <h2>4. Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the Portal for unlawful, fraudulent, abusive, or misleading activities.</li>
          <li>
            Attempt to bypass security controls, App Check, access restrictions, or rate limits.
          </li>
          <li>Interfere with the Portal, its infrastructure, or another person’s access.</li>
          <li>Introduce malicious code or use automated tools in a way that disrupts service.</li>
          <li>
            Misrepresent Portal content as an official approval, permit, decision, or guarantee.
          </li>
        </ul>
      </section>

      <section>
        <h2>5. External services and links</h2>
        <p>
          The Portal links to the Bacolod G App, app stores, city systems, business websites, and
          other third-party services. Those destinations may have separate terms and privacy
          policies. The City does not control third-party content or availability, except for
          systems expressly operated by the City.
        </p>
      </section>

      <section>
        <h2>6. Intellectual property</h2>
        <p>
          Portal software, layout, branding, graphics, and original content may be protected by
          intellectual-property laws. Government information may be reused only as permitted by
          applicable law and any attribution or usage notices displayed with the material. City
          seals, logos, and official marks must not be used in a way that suggests unauthorized
          endorsement.
        </p>
      </section>

      <section>
        <h2>7. Disclaimer and limitation</h2>
        <p>
          The Portal is provided for public convenience. To the extent permitted by Philippine law,
          the City is not responsible for loss caused solely by temporary unavailability,
          third-party services, unauthorized use, or reliance on information that a user should have
          verified with the responsible office. Nothing in these terms excludes obligations or
          liabilities that cannot lawfully be excluded.
        </p>
      </section>

      <section>
        <h2>8. Changes to these terms</h2>
        <p>
          These terms may be updated when Portal features, laws, or government procedures change.
          The effective date shown above will be revised when material changes are published.
        </p>
      </section>

      <section>
        <h2>9. Governing law and contact</h2>
        <p>
          These terms are governed by the laws of the Republic of the Philippines. Questions may be
          directed to the City Government of Bacolod through the contact information on this Portal.
        </p>
        <Link className="button" to="/contact">
          Contact the City
        </Link>
      </section>
    </LegalLayout>
  )
}

function PrivacyPage() {
  return (
    <LegalLayout
      type="privacy"
      title="Privacy Policy"
      summary="How Bacolod eGov Web handles information when you browse the public portal."
    >
      <section>
        <h2>1. Scope</h2>
        <p>
          This Privacy Policy applies to Bacolod eGov Web. It does not automatically apply to the
          Bacolod G App, app stores, external business websites, or other linked systems, which may
          provide their own privacy notices.
        </p>
      </section>

      <section>
        <h2>2. Personal information controller</h2>
        <p>
          For information processed through this Portal, the City Government of Bacolod acts as the
          personal information controller, subject to Republic Act No. 10173 or the Data Privacy Act
          of 2012, its Implementing Rules and Regulations, and applicable National Privacy
          Commission issuances.
        </p>
      </section>

      <section>
        <h2>3. Information processed by the Portal</h2>
        <p>
          The Portal does not currently provide account registration or a web contact-submission
          form. It does not intentionally request sensitive personal information through its public
          pages.
        </p>
        <p>
          When you browse the Portal, limited technical information may be processed, including:
        </p>
        <ul>
          <li>IP address and general request information.</li>
          <li>Browser, device, operating-system, and language information.</li>
          <li>Security and integrity signals used by Firebase App Check and reCAPTCHA.</li>
          <li>Dates, times, requested pages, error information, and security events.</li>
          <li>Browser storage required for security tokens and essential service operation.</li>
        </ul>
        <p>
          Public news, events, destinations, jobs, and business listings displayed by the Portal are
          retrieved from authorized public data sources. The Portal does not use this public content
          to create visitor profiles.
        </p>
      </section>

      <section>
        <h2>4. Purposes of processing</h2>
        <p>Technical information is processed only as reasonably necessary to:</p>
        <ul>
          <li>Deliver Portal pages and public information.</li>
          <li>Protect Firebase and City services against abuse and unauthorized access.</li>
          <li>Diagnose errors, maintain availability, and improve reliability.</li>
          <li>Meet legal, audit, cybersecurity, and public-service obligations.</li>
        </ul>
      </section>

      <section>
        <h2>5. Service providers and disclosure</h2>
        <p>
          The Portal uses Google Firebase services, including Hosting, Firestore, and App Check with
          reCAPTCHA. Google may process technical data on infrastructure located outside the
          Philippines, subject to its contractual and security safeguards. Information may also be
          disclosed when required by law, lawful government authority, security investigation, or
          the protection of public systems and users.
        </p>
        <p>
          The Portal does not currently use advertising cookies or sell visitor personal
          information.
        </p>
      </section>

      <section>
        <h2>6. Retention</h2>
        <p>
          The Portal retains technical information only for as long as necessary for security,
          operations, troubleshooting, audit, or legal requirements. Retention periods may depend on
          Firebase configuration, system logs, applicable government records rules, and the nature
          of a security incident. The Portal itself does not store service-request form submissions
          because those transactions are redirected to the Bacolod G App.
        </p>
      </section>

      <section>
        <h2>7. Security</h2>
        <p>
          Reasonable organizational and technical safeguards are used to protect the Portal,
          including HTTPS, access controls, Firebase security rules, App Check, restricted public
          data fields, and monitoring. No internet service can guarantee absolute security, so
          suspected security or privacy incidents should be reported promptly.
        </p>
      </section>

      <section>
        <h2>8. Your data privacy rights</h2>
        <p>
          Subject to applicable law, data subjects may exercise rights including the rights to be
          informed, access, object, rectify, erase or block, obtain data portability, claim damages,
          and file a complaint with the National Privacy Commission. The applicability of a
          particular right depends on the processing activity and its lawful basis.
        </p>
        <p>
          Learn more from the{' '}
          <a href="https://privacy.gov.ph/data-subject-rights/" target="_blank" rel="noreferrer">
            National Privacy Commission’s data-subject rights guidance
          </a>
          .
        </p>
      </section>

      <section>
        <h2>9. Children’s privacy</h2>
        <p>
          The Portal provides general public information and is not designed to collect personal
          information directly from children. A parent or guardian should supervise a child’s use of
          linked transactional services.
        </p>
      </section>

      <section>
        <h2>10. Policy updates and contact</h2>
        <p>
          This policy may be updated when Portal features, service providers, legal requirements, or
          processing activities change. Privacy questions and requests may be sent to the City using
          the contact details below. Identity verification may be required before acting on a
          request involving personal information.
        </p>
        <div className="legal-contact-card">
          <b>City Government of Bacolod</b>
          <span>Bacolod City Government Center, Brgy. Villamonte, Bacolod City</span>
          <a href="mailto:info@bacolodcity.gov.ph">info@bacolodcity.gov.ph</a>
          <a href="tel:+63344349122">(034) 434-9122</a>
        </div>
      </section>
    </LegalLayout>
  )
}

export { PrivacyPage, TermsPage }
