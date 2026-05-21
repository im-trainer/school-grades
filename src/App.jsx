import { useState } from 'react'
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

  const totalGrades = subjects.reduce((sum, s) => sum + s.grades.length, 0)
  const existingNames = subjects.map(s => s.name.toLowerCase())

  function handleLoadDefaults(classNum) {
    const count = addSubjectsBatch(SUBJECTS_BY_CLASS[classNum])
    setShowClassPicker(false)
    const msg = count === 0
      ? `Toate materiile pentru clasa ${classNum} sunt deja în listă.`
      : `${count} materii noi adăugate pentru clasa ${classNum}.`
    setToast(msg)
    setTimeout(() => setToast(null), 4000)
  }

  return (
    <div className="app">
      <Header />
      <main className="main">
        <OverallAverage
          average={overallAverage}
          subjectCount={subjects.length}
          gradeCount={totalGrades}
        />
        <SubjectList
          subjects={subjects}
          subjectAverages={subjectAverages}
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
