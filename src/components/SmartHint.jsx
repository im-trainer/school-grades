import { useMemo } from 'react'

const DEFAULT_GRADE = 8

export default function SmartHint({ grades, currentAverage, simGrade, onSimGradeChange }) {
  const displayGrade = simGrade ?? DEFAULT_GRADE

  const newAverage = useMemo(() => {
    const allGrades = [...grades, displayGrade]
    return Math.round(allGrades.reduce((a, b) => a + b, 0) / allGrades.length)
  }, [grades, displayGrade])

  const delta = currentAverage !== null ? newAverage - currentAverage : null
  const deltaText = delta === null ? '' : delta > 0 ? `+${delta}` : delta < 0 ? `${delta}` : '±0'
  const deltaClass = delta === null ? 'neutral' : delta > 0 ? 'positive' : delta < 0 ? 'negative' : 'neutral'

  return (
    <div className="smart-hint">
      <div className="smart-hint-body">
        <label className="smart-hint-label">
          Dacă ai lua nota <strong>{displayGrade}</strong> în plus:
        </label>
        <div className="smart-hint-slider-row">
          <span className="slider-min">1</span>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={displayGrade}
            onChange={e => onSimGradeChange(Number(e.target.value))}
            className="smart-hint-slider"
            aria-label="Nota ipotetică"
          />
          <span className="slider-max">10</span>
        </div>
        <div className={`smart-hint-result ${deltaClass}`}>
          Media ar fi <strong>{newAverage}</strong>
          {delta !== null && <span className="smart-hint-delta"> ({deltaText})</span>}
        </div>
      </div>
    </div>
  )
}
