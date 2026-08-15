import { useState } from 'react'

function shuffleArray(arr) {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export default function NamesTab({ names, setNames, t }) {
  const [input, setInput] = useState('')
  const [confirmClear, setConfirmClear] = useState(false)

  function addNames() {
    const raw = input
    if (!raw.trim()) return
    const parts = raw
      .split(/[\n,،]/)
      .map((s) => s.trim())
      .filter(Boolean)
    if (parts.length === 0) return
    setNames([...names, ...parts])
    setInput('')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      addNames()
    }
  }

  function removeName(index) {
    setNames(names.filter((_, i) => i !== index))
  }

  function shuffle() {
    setNames(shuffleArray(names))
  }

  function handleClearAll() {
    if (!confirmClear) {
      setConfirmClear(true)
      setTimeout(() => setConfirmClear(false), 3000)
      return
    }
    setNames([])
    setConfirmClear(false)
  }

  return (
    <div className="names-tab">
      <div className="names-input-row">
        <textarea
          className="names-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('namePlaceholder')}
          rows={2}
        />
        <button type="button" className="primary-btn" onClick={addNames}>
          {t('add')}
        </button>
      </div>

      <div className="names-toolbar">
        <span className="names-count">{t('namesCount', names.length)}</span>
        <div className="names-toolbar-actions">
          <button type="button" className="secondary-btn" onClick={shuffle} disabled={names.length < 2}>
            {t('shuffle')}
          </button>
          <button
            type="button"
            className={confirmClear ? 'danger-btn confirming' : 'danger-btn'}
            onClick={handleClearAll}
            disabled={names.length === 0}
          >
            {confirmClear ? t('clearAllConfirm') : t('clearAll')}
          </button>
        </div>
      </div>

      {names.length === 0 ? (
        <p className="empty-state">{t('namesEmpty')}</p>
      ) : (
        <ul className="names-list">
          {names.map((name, i) => (
            <li key={`${name}-${i}`} className="names-list-item">
              <span>{name}</span>
              <button
                type="button"
                className="icon-btn"
                onClick={() => removeName(i)}
                aria-label={t('removeName')}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
