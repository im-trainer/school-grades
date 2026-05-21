import { useEffect } from 'react'

const LEVEL = { primar: [1,2,3,4], gimnaziu: [5,6,7,8], liceu: [9,10,11,12] }

export default function ClassPickerModal({ onSelect, onClose }) {
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">Ce clasă ești?</h2>
        <p className="modal-subtitle">
          Materiile standard vor fi adăugate automat.<br />
          Cele deja existente în listă sunt ignorate.
        </p>

        {Object.entries(LEVEL).map(([label, classes]) => (
          <div key={label} className="modal-section">
            <span className="modal-section-label">{label}</span>
            <div className="class-row">
              {classes.map(cls => (
                <button key={cls} className="btn-class" onClick={() => onSelect(cls)}>
                  {cls}
                </button>
              ))}
            </div>
          </div>
        ))}

        <button className="btn btn-cancel modal-close-btn" onClick={onClose}>
          Anulează
        </button>
      </div>
    </div>
  )
}
