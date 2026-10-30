import { Check, X } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { firebaseReady, submitRequest } from '../firebase'

function RequestModal({ type, onClose }: { type: string; onClose: () => void }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [reference, setReference] = useState('')
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('loading')
    const form = new FormData(event.currentTarget)
    try {
      const result = await submitRequest({
        service: type,
        name: String(form.get('name')),
        email: String(form.get('email')),
        details: String(form.get('details')),
      })
      setReference(result.reference)
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }
  return (
    <div
      className="modal fixed inset-0 z-[100] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      onMouseDown={(event) => event.currentTarget === event.target && onClose()}
    >
      <div className="modal-card relative w-[min(92vw,560px)]">
        <button
          className="modal-close absolute inline-flex items-center justify-center"
          onClick={onClose}
          aria-label="Close request form"
        >
          <X aria-hidden="true" />
        </button>
        {status === 'done' ? (
          <div className="success-panel compact text-center">
            <i aria-hidden="true">
              <Check />
            </i>
            <h2>Request received</h2>
            <p>
              Reference: <b>{reference}</b>
            </p>
            {!firebaseReady && (
              <small>Demo mode is active until Firebase credentials are added.</small>
            )}
            <button className="button" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <>
            <span className="eyebrow">{type}</span>
            <h2>Send your request</h2>
            <form className="flex flex-col" onSubmit={handleSubmit}>
              <label>
                Full name
                <input name="name" required />
              </label>
              <label>
                Email address
                <input name="email" type="email" required />
              </label>
              <label>
                Details
                <textarea name="details" rows={4} required />
              </label>
              {status === 'error' && <p className="error">Submission failed. Please try again.</p>}
              <button className="button" disabled={status === 'loading'}>
                {status === 'loading' ? 'Submitting…' : 'Submit request'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default RequestModal
