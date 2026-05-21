import { useState } from 'react'
import GradeChip from './GradeChip'
import SmartHint from './SmartHint'

export default function SubjectCard({ subject, average, collapsed, onToggleCollapse, onDelete, onRename, onAddGrade, onDeleteGrade }) {
  const [editing, setEditing] = useState(false)
  const [nameInput, setNameInput] = useState(subject.name)
  const [gradeInput, setGradeInput] = useState('')
  const [gradeError, setGradeError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

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

  return (
    <div className={`subject-card ${colorClass}${collapsed ? ' collapsed' : ''}`}>
      <div className="subject-card-header">
        {editing ? (
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
            className="subject-name"
            onClick={() => { setEditing(true); setNameInput(subject.name) }}
            title="Click pentru a edita numele"
          >
            {subject.name}
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

          <SmartHint grades={subject.grades} currentAverage={average} />

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
