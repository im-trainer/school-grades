import { useState, useMemo } from 'react'

export default function SmartHint({ grades, currentAverage }) {
  const [hypotheticalGrade, setHypotheticalGrade] = useState(10)
  const [open, setOpen] = useState(false)

  const newAverage = useMemo(() => {
    const allGrades = [...grades, hypotheticalGrade]
    return Math.round(allGrades.reduce((a, b) => a + b, 0) / allGrades.length)
  }, [grades, hypotheticalGrade])

  const delta = currentAverage !== null ? newAverage - currentAverage : null

  const deltaText = delta === null ? ''
    : delta > 0 ? `+${delta}`
    : delta < 0 ? `${delta}`
    : '±0'

  const deltaClass = delta === null ? 'neutral'
    : delta > 0 ? 'positive'
    : delta < 0 ? 'negative'
    : 'neutral'

  return (
    <div className="smart-hint">
      <button
        className="smart-hint-toggle"
        onClick={() => setOpen(o => !o)}
        type="button"
      >
        {open ? 'Ascunde simulare ▲' : 'Simulare notă ▼'}
      </button>
      {open && (
        <div className="smart-hint-body">
          <label className="smart-hint-label">
            Dacă ai lua nota <strong>{hypotheticalGrade}</strong> în plus:
          </label>
          <div className="smart-hint-slider-row">
            <span className="slider-min">1</span>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={hypotheticalGrade}
              onChange={e => setHypotheticalGrade(Number(e.target.value))}
              className="smart-hint-slider"
              aria-label="Nota ipotetică"
            />
            <span className="slider-max">10</span>
          </div>
          <div className={`smart-hint-result ${deltaClass}`}>
            Media ar fi <strong>{newAverage}</strong>
            {delta !== null && (
              <span className="smart-hint-delta"> ({deltaText})</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
