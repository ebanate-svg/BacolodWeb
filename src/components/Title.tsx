import type { ReactNode } from 'react'

function Title({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string
  title: ReactNode
  description?: string
}) {
  return (
    <div className="section-title">
      {eyebrow && <span>{eyebrow}</span>}
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  )
}

export default Title
