import { useState } from 'react'

function formatTime(iso, lang) {
  try {
    const date = new Date(iso)
    return new Intl.DateTimeFormat(lang === 'ar' ? 'ar' : 'en', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date)
  } catch {
    return iso
  }
}

export default function HistoryTab({ history, setHistory, lang, t }) {
  const [confirmClear, setConfirmClear] = useState(false)

  function handleClear() {
    if (!confirmClear) {
      setConfirmClear(true)
      setTimeout(() => setConfirmClear(false), 3000)
      return
    }
    setHistory([])
    setConfirmClear(false)
  }

  return (
    <div className="history-tab">
      <div className="history-toolbar">
        <h2>{t('historyTitle')}</h2>
        <button
          type="button"
          className={confirmClear ? 'danger-btn confirming' : 'danger-btn'}
          onClick={handleClear}
          disabled={history.length === 0}
        >
          {confirmClear ? t('clearHistoryConfirm') : t('clearHistory')}
        </button>
      </div>

      {history.length === 0 ? (
        <p className="empty-state">{t('historyEmpty')}</p>
      ) : (
        <ul className="history-list">
          {history.map((entry) => (
            <li key={entry.id} className="history-list-item">
              <span className="history-name">{entry.name}</span>
              <span className="history-time">{formatTime(entry.time, lang)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
