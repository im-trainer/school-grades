export default function OverallAverage({ average, subjectCount, gradeCount, simulationMode, onToggleSimulation, simulatedAverage, simCount }) {
  const colorClass = average === null ? '' : average >= 7 ? 'good' : average >= 5 ? 'ok' : 'bad'
  const simColorClass = simulatedAverage === null ? '' : simulatedAverage >= 7 ? 'good' : simulatedAverage >= 5 ? 'ok' : 'bad'

  return (
    <div className={`overall-card ${colorClass}`}>
      <div className="overall-top-row">
        <div className="overall-label">Media Generală</div>
        <button
          className={`btn-sim-toggle${simulationMode ? ' active' : ''}`}
          onClick={onToggleSimulation}
          type="button"
          title={simulationMode ? 'Oprește simularea' : 'Activează simularea notelor'}
        >
          🔬 {simulationMode ? 'Simulare activă' : 'Simulare'}
        </button>
      </div>

      <div className="overall-values-row">
        <div className="overall-value">{average !== null ? average.toFixed(2) : '—'}</div>
        {simulationMode && (
          <div className="overall-sim-block">
            {simulatedAverage !== null ? (
              <>
                <span className="overall-sim-label">simulat</span>
                <span className={`overall-sim-value ${simColorClass}`}>{simulatedAverage.toFixed(2)}</span>
              </>
            ) : (
              <span className="overall-sim-hint">Mută cursoarele pentru a simula</span>
            )}
          </div>
        )}
      </div>

      <div className="overall-meta">
        {subjectCount === 0
          ? 'Nicio materie adăugată'
          : `${subjectCount} ${subjectCount === 1 ? 'materie' : 'materii'} · ${gradeCount} ${gradeCount === 1 ? 'notă' : 'note'}`}
        {simulationMode && simCount > 0 && (
          <span className="overall-sim-count">
            {' '}· {simCount} {simCount === 1 ? 'materie simulată' : 'materii simulate'}
          </span>
        )}
      </div>
    </div>
  )
}
