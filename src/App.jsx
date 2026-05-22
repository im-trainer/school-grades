import { useState, useMemo } from 'react'
import Header from './components/Header'
import OverallAverage from './components/OverallAverage'
import AddSubjectForm from './components/AddSubjectForm'
import SubjectList from './components/SubjectList'
import ExportButton from './components/ExportButton'
import ClassPickerModal from './components/ClassPickerModal'
import { useGrades } from './hooks/useGrades'
import { SUBJECTS_BY_CLASS } from './data/defaultSubjects'

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
    addGrade,
    deleteGrade,
    exportCSV,
    importCSV,
  } = useGrades()

  const [showClassPicker, setShowClassPicker] = useState(false)
  const [toast, setToast] = useState(null)
  const [simulationMode, setSimulationMode] = useState(false)
  const [simGrades, setSimGrades] = useState({})

  const totalGrades = subjects.reduce((sum, s) => sum + s.grades.length, 0)
  const existingNames = subjects.map(s => s.name.toLowerCase())

  function setSimGrade(subjectId, grade) {
    setSimGrades(prev => ({ ...prev, [subjectId]: grade }))
  }

  // Simulated per-subject averages (only for subjects where user moved slider)
  const simulatedSubjectAverages = useMemo(() => {
    const map = {}
    for (const s of subjects) {
      const simGrade = simGrades[s.id]
      if (simGrade !== undefined) {
        const allGrades = [...s.grades, simGrade]
        map[s.id] = Math.round(allGrades.reduce((a, b) => a + b, 0) / allGrades.length)
      }
    }
    return map
  }, [subjects, simGrades])

  // Simulated overall: all subjects, using simulated avg where slider was moved
  // Only shown when at least one slider has been touched
  const simulatedOverallAverage = useMemo(() => {
    if (!simulationMode) return null
    const hasAny = subjects.some(s => simGrades[s.id] !== undefined)
    if (!hasAny) return null
    const values = subjects
      .map(s => {
        const simAvg = simulatedSubjectAverages[s.id]
        return simAvg !== undefined ? simAvg : subjectAverages[s.id]
      })
      .filter(v => v !== null)
    if (values.length === 0) return null
    return parseFloat((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2))
  }, [simulationMode, subjects, simGrades, simulatedSubjectAverages, subjectAverages])

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
        />
        <SubjectList
          subjects={subjects}
          subjectAverages={subjectAverages}
          simulationMode={simulationMode}
          simGrades={simGrades}
          onSimGradeChange={setSimGrade}
          simulatedSubjectAverages={simulatedSubjectAverages}
          onDelete={deleteSubject}
          onRename={renameSubject}
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
