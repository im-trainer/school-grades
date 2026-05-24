import { useState, useEffect, useRef } from 'react'

export default function GradeChip({ grade, onDelete }) {
  const [confirming, setConfirming] = useState(false)
  const timerRef = useRef(null)
  const colorClass = grade >= 7 ? 'good' : grade >= 5 ? 'ok' : 'bad'

  function handleClick() {
    if (confirming) {
      clearTimeout(timerRef.current)
      onDelete()
    } else {
      setConfirming(true)
      timerRef.current = setTimeout(() => setConfirming(false), 2000)
    }
  }

  function handleBlur() {
    clearTimeout(timerRef.current)
    setConfirming(false)
  }

  useEffect(() => () => clearTimeout(timerRef.current), [])

  return (
    <span className={`grade-chip ${colorClass}${confirming ? ' confirming' : ''}`}>
      {grade}
      <button
        className="grade-chip-delete"
        onClick={handleClick}
        onBlur={handleBlur}
        aria-label={confirming ? `Confirmă ștergerea notei ${grade}` : `Șterge nota ${grade}`}
        type="button"
        title={confirming ? 'Click din nou pentru a confirma' : 'Șterge nota'}
      >
        {confirming ? '✓' : '×'}
      </button>
    </span>
  )
}
