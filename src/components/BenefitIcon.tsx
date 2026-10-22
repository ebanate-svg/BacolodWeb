import type { ReactNode } from 'react'

export type BenefitIconName = 'convenience' | 'process' | 'accessibility' | 'updates'

const paths: Record<BenefitIconName, ReactNode> = {
  convenience: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7v5l3 2" />
      <path d="m7.5 12.5 2 2 4-4" />
    </>
  ),
  process: (
    <>
      <path d="m13 2-7 11h6l-1 9 7-12h-6l1-8Z" />
    </>
  ),
  accessibility: (
    <>
      <circle cx="12" cy="5" r="2" />
      <path d="M5 9h14" />
      <path d="M12 7v6" />
      <path d="m8 21 4-8 4 8" />
    </>
  ),
  updates: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </>
  ),
}

export default function BenefitIcon({ name }: { name: BenefitIconName }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}
