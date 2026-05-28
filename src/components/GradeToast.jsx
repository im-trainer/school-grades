import { useEffect, useRef, useState } from 'react'

const ENCOURAGE_MESSAGES = [
  "Nu te descuraja! Fiecare notă e o lecție nouă. 💪",
  "Media a scăzut puțin, dar poți recupera! Hai că poți! 🌟",
  "O notă mai mică nu te definește. Încearcă din nou! 🎯",
  "E normal să mai greșim. Important e să continuăm! 🔥",
  "Media a scăzut, dar viitorul e plin de oportunități! 🚀",
  "Nu renunța! Cei mai buni elevi au și zile mai grele. 💡",
  "Fiecare provocare te face mai puternic! Continuă! 🦁",
  "Ai tot potențialul să urci înapoi! La treabă! ⚡",
  "O singură notă nu schimbă totul. Hai la studiat! 📚",
  "Momentele dificile formează caractere puternice! 🏆",
]

const CONGRATS_MESSAGES = [
  "Felicitări! Media a crescut! Ești pe drumul cel bun! 🎉",
  "Bravo! Munca grea dă roade! Continuă tot așa! ⭐",
  "Excelent! Media a crescut! Ești o adevărată stea! 🌟",
  "Super! Progresezi vizibil! Ești mândria clasei! 🏆",
  "Minunat! Nota asta a ridicat media! Mergi înainte! 🚀",
  "Wow! Efortul tău se vede! Continuă! 💫",
  "Media a crescut! Ești pe val — de neoprit! 🔥",
  "Ce progres frumos! Ești un exemplu pentru toți! 👑",
  "Fantastică notă! Media ta zâmbește acum! 😊",
  "Bravo! Perseverența ta dă rezultate! 💪",
]

export default function GradeToast({ type, id, onDismiss }) {
  const [leaving, setLeaving] = useState(false)
  const onDismissRef = useRef(onDismiss)
  useEffect(() => { onDismissRef.current = onDismiss }, [onDismiss])

  const [message] = useState(() => {
    const list = type === 'up' ? CONGRATS_MESSAGES : ENCOURAGE_MESSAGES
    return list[Math.floor(Math.random() * list.length)]
  })

  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), 4500)
    const t2 = setTimeout(() => onDismissRef.current(), 5000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div
      key={id}
      className={`grade-toast grade-toast--${type}${leaving ? ' grade-toast--leaving' : ''}`}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  )
}
