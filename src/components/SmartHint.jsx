import UpgradeBadge from './UpgradeBadge'

// Returns the minimum grade (1–10) that, if added, raises the rounded average.
// Returns null if not possible or not applicable.
function findUpgradeGrade(grades, currentAverage) {
  if (currentAverage === null || currentAverage >= 10 || grades.length === 0) return null
  const sum = grades.reduce((a, b) => a + b, 0)
  for (let g = 1; g <= 10; g++) {
    const newAvg = Math.round((sum + g) / (grades.length + 1))
    if (newAvg > currentAverage) return g
  }
  return null
}

// Returnează 1/2/3 = câte puncte peste medie sunt necesare pentru a crește media rotunjită
function upgradeOpportunity(grades, avg) {
  if (avg === null || avg >= 10 || grades.length === 0) return null
  const sum = grades.reduce((a, b) => a + b, 0)
  const count = grades.length
  for (let delta = 1; delta <= 3; delta++) {
    const hypothetical = avg + delta
    if (hypothetical > 10) break
    if (Math.round((sum + hypothetical) / (count + 1)) > avg) return delta
  }
  return null
}

export default function SmartHint({ grades, currentAverage, simGrades, onAddSimGrade, onRemoveSimGrade }) {
  const allGrades = [...grades, ...simGrades]
  const simAvg = simGrades.length > 0
    ? Math.round(allGrades.reduce((a, b) => a + b, 0) / allGrades.length)
    : null
  const delta = simAvg !== null && currentAverage !== null ? simAvg - currentAverage : null

  const upgradeGrade = findUpgradeGrade(grades, currentAverage)
  const effort = upgradeOpportunity(grades, currentAverage)

  function formatGrades(arr) {
    if (arr.length === 1) return `nota ${arr[0]}`
    return `notele ${arr.slice(0, -1).join(', ')} și ${arr[arr.length - 1]}`
  }

  return (
    <div className="smart-hint">
      <div className="sim-grade-picker">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(g => (
          <button
            key={g}
            type="button"
            className={`sim-grade-btn grade-color-${g <= 4 ? 'bad' : g <= 6 ? 'ok' : 'good'}${g === 10 ? ' grade-ten' : ''}`}
            onClick={() => onAddSimGrade(g)}
            title={`Simulează nota ${g}`}
          >
            {g}
          </button>
        ))}
      </div>

      {simGrades.length > 0 && (
        <div className="sim-grades-chips">
          {simGrades.map((g, i) => (
            <span key={i} className={`sim-grade-chip${g === 10 ? ' grade-ten' : ''}`}>
              {g}
              <button
                className="sim-grade-chip-delete"
                onClick={() => onRemoveSimGrade(i)}
                type="button"
                aria-label={`Șterge nota simulată ${g}`}
              >×</button>
            </span>
          ))}
        </div>
      )}

      {simAvg !== null && currentAverage !== null && (
        <p className="sim-result">
          Dacă ai lua {formatGrades(simGrades)}, media ar fi{' '}
          <strong>{simAvg}</strong>
          {delta !== 0 && (
            <span className={delta > 0 ? 'sim-delta-pos' : 'sim-delta-neg'}>
              {' '}({delta > 0 ? '+' : ''}{delta})
            </span>
          )}
        </p>
      )}

      {simGrades.length === 0 && upgradeGrade !== null && (
        <div className="sim-upgrade-hint">
          {effort !== null && <UpgradeBadge effort={effort} />}
          <span>Dacă ai lua nota <strong>{upgradeGrade}</strong>, ți-ai crește media <span className="sim-hint-bulb">💡</span></span>
        </div>
      )}
      {simGrades.length === 0 && (
        <p className="sim-hint-empty">Alege note simulate pentru această materie</p>
      )}
    </div>
  )
}
