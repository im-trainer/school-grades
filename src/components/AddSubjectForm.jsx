import { useState } from 'react'

export default function AddSubjectForm({ onAdd, existingNames }) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Introdu numele materiei.')
      return
    }
    if (existingNames.includes(trimmed.toLowerCase())) {
      setError('Această materie există deja.')
      return
    }
    onAdd(trimmed)
    setName('')
    setError('')
  }

  return (
    <form className="add-subject-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Numele materiei (ex: Matematică)"
        value={name}
        onChange={e => { setName(e.target.value); setError('') }}
        className="add-subject-input"
        maxLength={80}
      />
      <button type="submit" className="btn btn-primary">Adaugă</button>
      {error && <span className="form-error">{error}</span>}
    </form>
  )
}
