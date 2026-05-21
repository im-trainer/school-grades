export default function GradeChip({ grade, onDelete }) {
  const colorClass = grade >= 7 ? 'good' : grade >= 5 ? 'ok' : 'bad'

  return (
    <span className={`grade-chip ${colorClass}`}>
      {grade}
      <button
        className="grade-chip-delete"
        onClick={onDelete}
        aria-label={`Șterge nota ${grade}`}
        type="button"
        title="Șterge nota"
      >
        ×
      </button>
    </span>
  )
}
