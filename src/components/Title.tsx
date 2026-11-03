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
    <div className="section-title mx-auto mb-9 max-w-[680px] text-center">
      {eyebrow && <span className="inline-flex items-center justify-center">{eyebrow}</span>}
      <h2 className="font-heading font-extrabold tracking-[-0.035em]">{title}</h2>
      {description && <p className="mx-auto text-brand-muted">{description}</p>}
    </div>
  )
}

export default Title
