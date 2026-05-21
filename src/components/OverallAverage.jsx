export default function OverallAverage({ average, subjectCount, gradeCount }) {
  const colorClass = average === null ? '' : average >= 7 ? 'good' : average >= 5 ? 'ok' : 'bad'

  return (
    <div className={`overall-card ${colorClass}`}>
      <div className="overall-label">Media Generală</div>
      <div className="overall-value">{average !== null ? average.toFixed(2) : '—'}</div>
      <div className="overall-meta">
        {subjectCount === 0
          ? 'Nicio materie adăugată'
          : `${subjectCount} ${subjectCount === 1 ? 'materie' : 'materii'} · ${gradeCount} ${gradeCount === 1 ? 'notă' : 'note'}`}
      </div>
    </div>
  )
}
