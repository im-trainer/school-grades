import SubjectCard from './SubjectCard'
import { usePersistentState } from '../hooks/usePersistentState'

const SORT_OPTIONS = [
  { field: 'name',    label: 'Alfabetic' },
  { field: 'average', label: 'Medie' },
  { field: 'count',   label: 'Nr. note' },
]

export default function SubjectList({ subjects, subjectAverages, simulationMode, simGrades, onAddSimGrade, onRemoveSimGrade, simulatedSubjectAverages, onDelete, onRename, onUpdateTeacher, onAddGrade, onDeleteGrade }) {
  // Persist sort + collapsed state across refreshes
  const [sortField, setSortField] = usePersistentState('school-grades-ui-sort-field', 'name')
  const [sortDir, setSortDir]     = usePersistentState('school-grades-ui-sort-dir', 'asc')
  // Store collapsed IDs as plain array in localStorage, expose as Set internally
  const [collapsedArr, setCollapsedArr] = usePersistentState('school-grades-ui-collapsed', [])
  const collapsedIds = new Set(collapsedArr)

  // Accepts a Set or a Set-returning updater (same API as the old useState setter)
  function setCollapsedIds(setOrUpdater) {
    if (typeof setOrUpdater === 'function') {
      setCollapsedArr(prev => [...setOrUpdater(new Set(prev))])
    } else {
      setCollapsedArr([...setOrUpdater])
    }
  }

  if (subjects.length === 0) {
    return (
      <div className="empty-state">
        <p>Nu ai adăugat nicio materie. Adaugă prima ta materie mai jos!</p>
      </div>
    )
  }

  const allCollapsed = subjects.length > 0 && subjects.every(s => collapsedIds.has(s.id))
  const anyCollapsed = subjects.some(s => collapsedIds.has(s.id))

  function collapseAll() { setCollapsedIds(new Set(subjects.map(s => s.id))) }
  function expandAll()   { setCollapsedIds(new Set()) }
  function toggleCollapse(id) {
    setCollapsedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleSort(field) {
    if (field === sortField) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const sorted = [...subjects].sort((a, b) => {
    if (sortField === 'name') {
      const cmp = a.name.localeCompare(b.name, 'ro')
      return sortDir === 'asc' ? cmp : -cmp
    }
    if (sortField === 'average') {
      const avgA = subjectAverages[a.id] ?? -1
      const avgB = subjectAverages[b.id] ?? -1
      return sortDir === 'asc' ? avgA - avgB : avgB - avgA
    }
    if (sortField === 'count') {
      return sortDir === 'asc'
        ? a.grades.length - b.grades.length
        : b.grades.length - a.grades.length
    }
    return 0
  })

  return (
    <>
      <div className="list-controls">
        <div className="sort-controls">
          <div className="btn-group">
            {SORT_OPTIONS.map(({ field, label }) => {
              const active = sortField === field
              const arrow = sortDir === 'asc' ? '↑' : '↓'
              return (
                <button
                  key={field}
                  className={`btn btn-sort${active ? ' btn-sort--active' : ''}`}
                  onClick={() => handleSort(field)}
                  title={active ? (sortDir === 'asc' ? 'Schimbă în descrescător' : 'Schimbă în crescător') : `Sortează după ${label}`}
                >
                  {label}{active && <span className="sort-arrow">{arrow}</span>}
                </button>
              )
            })}
          </div>
        </div>

        <div className="btn-group">
          <button className="btn btn-sort" onClick={collapseAll} disabled={allCollapsed} title="Restrânge tot">▲</button>
          <button className="btn btn-sort" onClick={expandAll}   disabled={!anyCollapsed} title="Extinde tot">▼</button>
        </div>
      </div>

      <div className="subject-grid">
        {sorted.map(subject => (
          <SubjectCard
            key={subject.id}
            subject={subject}
            average={subjectAverages[subject.id] ?? null}
            collapsed={collapsedIds.has(subject.id)}
            onToggleCollapse={() => toggleCollapse(subject.id)}
            simulationMode={simulationMode}
            simGrades={simGrades[subject.id] ?? []}
            onAddSimGrade={onAddSimGrade}
            onRemoveSimGrade={onRemoveSimGrade}
            simulatedAverage={simulatedSubjectAverages[subject.id]}
            onDelete={onDelete}
            onRename={onRename}
            onUpdateTeacher={onUpdateTeacher}
            onAddGrade={onAddGrade}
            onDeleteGrade={onDeleteGrade}
          />
        ))}
      </div>
    </>
  )
}
