import { useState, useEffect } from 'react'
import GradeChip from './GradeChip'
import SmartHint from './SmartHint'

// Returnează 1/2/3 = câte puncte peste medie sunt necesare pentru a crește media rotunjită
// null dacă nu se poate sau nu are sens
function upgradeOpportunity(grades, avg) {
  if (avg === null || avg >= 10 || grades.length === 0) return null
  const sum = grades.reduce((a, b) => a + b, 0)
  const count = grades.length
  for (let delta = 1; delta <= 3; delta++) {
    const hypothetical = avg + delta
    if (hypothetical > 10) break
    const newAvg = Math.round((sum + hypothetical) / (count + 1))
    if (newAvg > avg) return delta
  }
  return null
}

const EFFORT_LABEL = ['', 'Ușor de obținut (+1 față de medie)', 'Efort mediu (+2 față de medie)', 'Efort mai mare (+3 față de medie)']

function UpgradeBadge({ effort }) {
  return (
    <span
      className={`upgrade-badge effort-${effort}`}
      title={EFFORT_LABEL[effort]}
      aria-label={EFFORT_LABEL[effort]}
    >
      ↑
      <span className="upgrade-badge-notif">{effort}</span>
    </span>
  )
}

export default function SubjectCard({ subject, average, collapsed, onToggleCollapse, onDelete, onRename, onUpdateTeacher, onAddGrade, onDeleteGrade, simulationMode, simGrade, onSimGradeChange, simulatedAverage }) {
  const [editing, setEditing] = useState(false)
  const [nameInput, setNameInput] = useState(subject.name)
  const [teacherInput, setTeacherInput] = useState(subject.teacher || '')
  const [gradeInput, setGradeInput] = useState('')
  const [gradeError, setGradeError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  // Sync teacher input when subject changes from outside (e.g. import)
  useEffect(() => { setTeacherInput(subject.teacher || '') }, [subject.teacher])

  function handleTeacherBlur() {
    onUpdateTeacher(subject.id, teacherInput)
  }

  function handleNameBlur() {
    const trimmed = nameInput.trim()
    if (trimmed && trimmed !== subject.name) {
      onRename(subject.id, trimmed)
    } else {
      setNameInput(subject.name)
    }
    setEditing(false)
  }

  function handleAddGrade(e) {
    e.preventDefault()
    const val = parseInt(gradeInput, 10)
    if (isNaN(val) || val < 1 || val > 10) {
      setGradeError('Nota trebuie să fie între 1 și 10.')
      return
    }
    onAddGrade(subject.id, val)
    setGradeInput('')
    setGradeError('')
  }

  const colorClass = average === null ? 'no-grade' : average >= 7 ? 'good' : average >= 5 ? 'ok' : 'bad'
  const gradeCount = subject.grades.length
  const effort = upgradeOpportunity(subject.grades, average)
  const hasSimBadge = simulationMode && simulatedAverage !== undefined

  return (
    <div className={`subject-card ${colorClass}${collapsed ? ' collapsed' : ''}`}>
      <div className="subject-card-header">
        {editing && !collapsed ? (
          <input
            className="subject-name-input"
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
            onBlur={handleNameBlur}
            onKeyDown={e => {
              if (e.key === 'Enter') handleNameBlur()
              if (e.key === 'Escape') { setNameInput(subject.name); setEditing(false) }
            }}
            autoFocus
            maxLength={80}
          />
        ) : (
          <h2
            className={`subject-name${collapsed ? '' : ' editable'}`}
            onClick={() => { if (!collapsed) { setEditing(true); setNameInput(subject.name) } }}
            title={collapsed ? undefined : 'Click pentru a edita numele'}
          >
            {subject.name}
            {effort && <UpgradeBadge effort={effort} />}
          </h2>
        )}
        <div className="subject-header-right">
          {gradeCount > 0 && (
            <span className="grade-count-badge">
              {gradeCount} {gradeCount === 1 ? 'notă' : 'note'}
            </span>
          )}
          <div className={`average-badge ${colorClass}`}>
            {average !== null ? average : '—'}
          </div>
          {hasSimBadge && (
            <div className="average-badge sim-badge">
              ~{simulatedAverage}
            </div>
          )}
          <button
            className="btn-chevron"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Extinde materia' : 'Restrânge materia'}
            type="button"
          >
            {collapsed ? '▼' : '▲'}
          </button>
        </div>
      </div>

      {!collapsed && (
        <>
          <div className="teacher-row">
            <span className="teacher-icon">👤</span>
            <input
              className="teacher-input"
              type="text"
              value={teacherInput}
              onChange={e => setTeacherInput(e.target.value)}
              onBlur={handleTeacherBlur}
              onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur() }}
              placeholder="Numele profesorului (opțional)"
              maxLength={80}
              aria-label="Numele profesorului"
            />
          </div>

          <div className="grades-row">
            {gradeCount === 0 ? (
              <span className="no-grades-text">Nicio notă adăugată</span>
            ) : (
              subject.grades.map((g, i) => (
                <GradeChip
                  key={i}
                  grade={g}
                  onDelete={() => onDeleteGrade(subject.id, i)}
                />
              ))
            )}
          </div>

          <form className="add-grade-form" onSubmit={handleAddGrade}>
            <input
              type="number"
              min="1"
              max="10"
              placeholder="Notă (1–10)"
              value={gradeInput}
              onChange={e => { setGradeInput(e.target.value); setGradeError('') }}
              className="add-grade-input"
            />
            <button type="submit" className="btn btn-small">Adaugă notă</button>
            {gradeError && <span className="form-error">{gradeError}</span>}
          </form>

          {simulationMode && (
            <SmartHint
              grades={subject.grades}
              currentAverage={average}
              simGrade={simGrade}
              onSimGradeChange={grade => onSimGradeChange(subject.id, grade)}
            />
          )}

          <div className="subject-card-footer">
            {confirmDelete ? (
              <>
                <span className="confirm-text">Ești sigur?</span>
                <button className="btn btn-danger-small" onClick={() => onDelete(subject.id)}>Da, șterge</button>
                <button className="btn btn-cancel" onClick={() => setConfirmDelete(false)}>Nu</button>
              </>
            ) : (
              <button className="btn btn-ghost" onClick={() => setConfirmDelete(true)}>
                Șterge materia
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
