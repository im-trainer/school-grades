import { useState, useMemo } from 'react'
import Header from './components/Header'
import OverallAverage from './components/OverallAverage'
import AddSubjectForm from './components/AddSubjectForm'
import SubjectList from './components/SubjectList'
import ExportButton from './components/ExportButton'
import ClassPickerModal from './components/ClassPickerModal'
import { useGrades } from './hooks/useGrades'
import { usePersistentState } from './hooks/usePersistentState'
import { SUBJECTS_BY_CLASS } from './data/defaultSubjects'

// Migrate old simGrades shape { id: number } → discard, return {}
// New shape is { id: number[] }
function sanitiseSimGrades(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {}
  const hasOldFormat = Object.values(raw).some(v => typeof v === 'number')
  if (hasOldFormat) return {}
  // Keep only entries that are arrays of numbers
  return Object.fromEntries(
    Object.entries(raw).filter(([, v]) => Array.isArray(v) && v.every(n => typeof n === 'number'))
  )
}

export default function App() {
  const {
    subjects,
    subjectAverages,
    overallAverage,
    studentClass,
    setStudentClass,
    addSubject,
    addSubjectsBatch,
    deleteSubject,
    renameSubject,
    updateTeacher,
    addGrade,
    deleteGrade,
    exportCSV,
    importCSV,
  } = useGrades()

  const [showClassPicker, setShowClassPicker] = useState(false)
  const [toast, setToast] = useState(null)
  const [simulationMode, setSimulationMode] = usePersistentState('school-grades-ui-simulation', false)
  const [simGrades, setSimGrades]             = usePersistentState('school-grades-ui-sim-grades', {}, sanitiseSimGrades)

  const totalGrades = subjects.reduce((sum, s) => sum + s.grades.length, 0)
  const existingNames = subjects.map(s => s.name.toLowerCase())

  function addSimGrade(subjectId, grade) {
    setSimGrades(prev => ({ ...prev, [subjectId]: [...(prev[subjectId] ?? []), grade] }))
  }

  function removeSimGrade(subjectId, index) {
    setSimGrades(prev => {
      const arr = (prev[subjectId] ?? []).filter((_, i) => i !== index)
      const next = { ...prev }
      if (arr.length === 0) delete next[subjectId]
      else next[subjectId] = arr
      return next
    })
  }

  // Filter out deleted subjects from simGrades
  const normalisedSimGrades = useMemo(() => {
    const ids = new Set(subjects.map(s => s.id))
    return Object.fromEntries(Object.entries(simGrades).filter(([id]) => ids.has(id)))
  }, [subjects, simGrades])

  // Simulated per-subject averages (only for subjects where user added sim grades)
  const simulatedSubjectAverages = useMemo(() => {
    const map = {}
    for (const s of subjects) {
      const simArr = normalisedSimGrades[s.id]
      if (simArr && simArr.length > 0) {
        const allGrades = [...s.grades, ...simArr]
        map[s.id] = Math.round(allGrades.reduce((a, b) => a + b, 0) / allGrades.length)
      }
    }
    return map
  }, [subjects, normalisedSimGrades])

  // Simulated overall: only shown when at least one subject has sim grades
  const simulatedOverallAverage = useMemo(() => {
    if (!simulationMode) return null
    const hasAny = subjects.some(s => normalisedSimGrades[s.id]?.length > 0)
    if (!hasAny) return null
    const values = subjects
      .map(s => {
        const simAvg = simulatedSubjectAverages[s.id]
        return simAvg !== undefined ? simAvg : subjectAverages[s.id]
      })
      .filter(v => v !== null && v !== undefined)
    if (values.length === 0) return null
    return parseFloat((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2))
  }, [simulationMode, subjects, normalisedSimGrades, simulatedSubjectAverages, subjectAverages])

  function handleLoadDefaults(classNum) {
    const count = addSubjectsBatch(SUBJECTS_BY_CLASS[classNum])
    setStudentClass(classNum)
    setShowClassPicker(false)
    const msg = count === 0
      ? `Toate materiile pentru clasa ${classNum} sunt deja în listă.`
      : `${count} materii noi adăugate pentru clasa ${classNum}.`
    setToast(msg)
    setTimeout(() => setToast(null), 4000)
  }

  return (
    <div className="app">
      <Header studentClass={studentClass} onChangeClass={() => setShowClassPicker(true)} />
      <main className="main">
        <OverallAverage
          average={overallAverage}
          subjectCount={subjects.length}
          gradeCount={totalGrades}
          simulationMode={simulationMode}
          onToggleSimulation={() => setSimulationMode(m => !m)}
          simulatedAverage={simulatedOverallAverage}
          simCount={Object.keys(normalisedSimGrades).filter(id => normalisedSimGrades[id]?.length > 0).length}
        />
        <SubjectList
          subjects={subjects}
          subjectAverages={subjectAverages}
          simulationMode={simulationMode}
          simGrades={normalisedSimGrades}
          onAddSimGrade={addSimGrade}
          onRemoveSimGrade={removeSimGrade}
          simulatedSubjectAverages={simulatedSubjectAverages}
          onDelete={deleteSubject}
          onRename={renameSubject}
          onUpdateTeacher={updateTeacher}
          onAddGrade={addGrade}
          onDeleteGrade={deleteGrade}
        />
        <div className="bottom-bar">
          <AddSubjectForm onAdd={addSubject} existingNames={existingNames} />
          <ExportButton
            onExport={exportCSV}
            onImport={importCSV}
            onLoadDefaults={() => setShowClassPicker(true)}
            disabled={subjects.length === 0}
            subjectCount={subjects.length}
          />
        </div>
        {toast && <p className="toast">{toast}</p>}
      </main>

      {showClassPicker && (
        <ClassPickerModal
          onSelect={handleLoadDefaults}
          onClose={() => setShowClassPicker(false)}
        />
      )}
    </div>
  )
}
