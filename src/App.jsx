import { useEffect, useState } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { getTranslator } from './i18n'
import WheelTab from './WheelTab'
import NamesTab from './NamesTab'
import HistoryTab from './HistoryTab'
import './App.css'

const DEFAULT_NAMES = []

export default function App() {
  const [names, setNames] = useLocalStorage('spinit.names', DEFAULT_NAMES)
  const [history, setHistory] = useLocalStorage('spinit.history', [])
  const [lang, setLang] = useLocalStorage('spinit.lang', 'ar')
  const [soundOn, setSoundOn] = useLocalStorage('spinit.sound', true)
  const [autoRemove, setAutoRemove] = useLocalStorage('spinit.autoRemove', false)
  const [activeTab, setActiveTab] = useState('wheel')
  const [lastSpin, setLastSpin] = useState(null)

  const t = getTranslator(lang)

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [lang])

  function toggleLang() {
    setLang(lang === 'ar' ? 'en' : 'ar')
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">{t('appTitle')}</h1>
        <div className="app-header-actions">
          <button
            type="button"
            className="icon-toggle"
            onClick={() => setSoundOn(!soundOn)}
            aria-label={soundOn ? t('soundOn') : t('soundOff')}
            title={soundOn ? t('soundOn') : t('soundOff')}
          >
            {soundOn ? '🔊' : '🔇'}
          </button>
          <button type="button" className="lang-toggle" onClick={toggleLang}>
            {t('langToggle')}
          </button>
        </div>
      </header>

      <main className="app-main">
        {activeTab === 'wheel' && (
          <WheelTab
            names={names}
            setNames={setNames}
            history={history}
            setHistory={setHistory}
            autoRemove={autoRemove}
            setAutoRemove={setAutoRemove}
            soundOn={soundOn}
            t={t}
            lastSpin={lastSpin}
            setLastSpin={setLastSpin}
          />
        )}
        {activeTab === 'names' && (
          <NamesTab names={names} setNames={setNames} t={t} />
        )}
        {activeTab === 'history' && (
          <HistoryTab history={history} setHistory={setHistory} lang={lang} t={t} />
        )}
      </main>

      <nav className="tab-bar">
        <button
          type="button"
          className={activeTab === 'wheel' ? 'tab-btn active' : 'tab-btn'}
          onClick={() => setActiveTab('wheel')}
        >
          <span className="tab-icon">🎡</span>
          <span>{t('tabWheel')}</span>
        </button>
        <button
          type="button"
          className={activeTab === 'names' ? 'tab-btn active' : 'tab-btn'}
          onClick={() => setActiveTab('names')}
        >
          <span className="tab-icon">📝</span>
          <span>{t('tabNames')}</span>
        </button>
        <button
          type="button"
          className={activeTab === 'history' ? 'tab-btn active' : 'tab-btn'}
          onClick={() => setActiveTab('history')}
        >
          <span className="tab-icon">🕘</span>
          <span>{t('tabHistory')}</span>
        </button>
      </nav>
    </div>
  )
}
