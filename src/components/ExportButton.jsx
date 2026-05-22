import { useRef, useState } from 'react'

export default function ExportButton({ onExport, onImport, onLoadDefaults, disabled, subjectCount }) {
  const fileInputRef = useRef(null)
  const [status, setStatus] = useState(null)

  async function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    if (subjectCount > 0) {
      const ok = window.confirm(
        `Importul va înlocui cele ${subjectCount} materii existente. Continui?`
      )
      if (!ok) { fileInputRef.current.value = ''; return }
    }
    setStatus(null)
    try {
      const count = await onImport(file)
      setStatus({ type: 'success', text: `${count} ${count === 1 ? 'materie importată' : 'materii importate'} cu succes!` })
    } catch (err) {
      setStatus({ type: 'error', text: err.message })
    } finally {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="data-controls">
      <button
        className="btn btn-defaults"
        onClick={onLoadDefaults}
        title="Adaugă automat materiile standard pentru o clasă"
      >
        Materii implicite
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        aria-label="Selectează fișier CSV pentru import"
      />
      <div className="btn-group">
        <button
          className="btn btn-import"
          onClick={() => fileInputRef.current?.click()}
          title="Importă note dintr-un fișier CSV"
        >
          Import CSV
        </button>
        <button
          className="btn btn-export"
          onClick={onExport}
          disabled={disabled}
          title={disabled ? 'Adaugă materii pentru a exporta' : 'Descarcă notele în format CSV'}
        >
          Export CSV
        </button>
      </div>
      {status && (
        <p className={`import-status import-status--${status.type}`}>{status.text}</p>
      )}
    </div>
  )
}
