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
      className="modal"
      role="dialog"
      aria-modal="true"
      onMouseDown={(event) => event.currentTarget === event.target && onClose()}
    >
      <div className="modal-card">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        {status === 'done' ? (
          <div className="success-panel compact">
            <i>✓</i>
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
            <form onSubmit={handleSubmit}>
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
