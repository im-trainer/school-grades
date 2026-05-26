const EFFORT_LABEL = [
  '',
  'Ușor de obținut (+1 față de medie)',
  'Efort mediu (+2 față de medie)',
  'Efort mai mare (+3 față de medie)',
]

export default function UpgradeBadge({ effort }) {
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
