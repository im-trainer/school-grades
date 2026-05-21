import { useState, useEffect, useMemo } from 'react'

const STORAGE_KEY = 'school-grades-v1'

function loadSubjects() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}
  return []
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function parseCSVLine(line) {
  const cells = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++ }
      else inQuotes = !inQuotes
    } else if (ch === ',' && !inQuotes) {
      cells.push(current)
      current = ''
    } else {
      current += ch
    }
  }
  cells.push(current)
  return cells
}

export function useGrades() {
  const [subjects, setSubjects] = useState(() => loadSubjects())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects))
  }, [subjects])

  const subjectAverages = useMemo(() => {
    const map = {}
    for (const s of subjects) {
      if (s.grades.length === 0) {
        map[s.id] = null
      } else {
        const sum = s.grades.reduce((a, b) => a + b, 0)
        map[s.id] = Math.round(sum / s.grades.length)
      }
    }
    return map
  }, [subjects])

  const overallAverage = useMemo(() => {
    const valid = Object.values(subjectAverages).filter(v => v !== null)
    if (valid.length === 0) return null
    return parseFloat((valid.reduce((a, b) => a + b, 0) / valid.length).toFixed(2))
  }, [subjectAverages])

  function addSubject(name) {
    setSubjects(prev => [...prev, { id: generateId(), name, grades: [] }])
  }

  function deleteSubject(id) {
    setSubjects(prev => prev.filter(s => s.id !== id))
  }

  function renameSubject(id, newName) {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, name: newName } : s))
  }

  function addGrade(subjectId, grade) {
    setSubjects(prev => prev.map(s =>
      s.id === subjectId ? { ...s, grades: [...s.grades, grade] } : s
    ))
  }

  function deleteGrade(subjectId, index) {
    setSubjects(prev => prev.map(s => {
      if (s.id !== subjectId) return s
      return { ...s, grades: s.grades.filter((_, i) => i !== index) }
    }))
  }

  function exportCSV() {
    if (subjects.length === 0) return
    const maxGrades = Math.max(...subjects.map(s => s.grades.length))
    const header = ['Materie', ...Array.from({ length: maxGrades }, (_, i) => `Nota ${i + 1}`)]

    function quoteCell(cell) {
      const str = String(cell)
      return str.includes(',') || str.includes('"') || str.includes('\n')
        ? `"${str.replace(/"/g, '""')}"`
        : str
    }

    const rows = [header, ...subjects.map(s => [s.name, ...s.grades])]
    const csv = rows.map(row => row.map(quoteCell).join(',')).join('\r\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `note-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  function importCSV(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = e => {
        try {
          const text = e.target.result.replace(/^﻿/, '')
          const lines = text.split(/\r?\n/).filter(l => l.trim())
          if (lines.length < 2) {
            reject(new Error('Fișierul nu conține date.'))
            return
          }
          const newSubjects = lines.slice(1).map(line => {
            const cells = parseCSVLine(line)
            const name = cells[0]?.trim()
            if (!name) return null
            const grades = cells.slice(1)
              .map(c => parseInt(c.trim(), 10))
              .filter(n => !isNaN(n) && n >= 1 && n <= 10)
            return { id: generateId(), name, grades }
          }).filter(Boolean)

          if (newSubjects.length === 0) {
            reject(new Error('Nu s-au găsit materii valide.'))
            return
          }
          setSubjects(newSubjects)
          resolve(newSubjects.length)
        } catch {
          reject(new Error('Fișier CSV invalid.'))
        }
      }
      reader.onerror = () => reject(new Error('Nu s-a putut citi fișierul.'))
      reader.readAsText(file, 'UTF-8')
    })
  }

  function addSubjectsBatch(names) {
    const existingLower = subjects.map(s => s.name.toLowerCase())
    const toAdd = names.filter(n => !existingLower.includes(n.toLowerCase()))
    if (toAdd.length === 0) return 0
    setSubjects(prev => [
      ...prev,
      ...toAdd.map(name => ({ id: generateId(), name, grades: [] })),
    ])
    return toAdd.length
  }

  return {
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
  }
}
